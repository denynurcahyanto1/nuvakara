-- NUVAKARA — 0001: profiles, admin activity log, and the helpers the
-- authorization layer depends on.
--
-- Applied by scripts/apply-migrations.mjs. Idempotent: safe to re-run.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  status text not null default 'active' check (status in ('active', 'suspended')),
  timezone text not null default 'Asia/Jakarta',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_activity_logs (
  id bigint generated always as identity primary key,
  admin_id uuid references public.profiles (id) on delete set null,
  admin_email text,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  ip text,
  created_at timestamptz not null default now()
);

create index if not exists admin_activity_logs_created_at_idx
  on public.admin_activity_logs (created_at desc);

create index if not exists admin_activity_logs_action_idx
  on public.admin_activity_logs (action);

-- Keeps updated_at honest without relying on the application layer.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Creates the profile row right after the auth user is created.
-- SECURITY DEFINER because the trigger runs as the auth admin role, which has
-- no insert privilege on public.profiles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- True when the caller is an active admin. SECURITY DEFINER + pinned
-- search_path so it can read profiles without recursing through its own
-- policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
      and p.status = 'active'
  );
$$;

-- Stops an owner from changing their own role or status. Only the service
-- role (server-side admin client) or an existing admin may do that.
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role) or (new.status is distinct from old.status) then
    if coalesce(current_setting('request.jwt.claim.role', true), '') <> 'service_role'
       and not public.is_admin() then
      raise exception 'role and status can only be changed by an administrator';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

alter table public.profiles enable row level security;
alter table public.admin_activity_logs enable row level security;

-- Owners can read their own profile.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

-- Owners can update their own profile. The trigger above blocks changes to
-- role and status for everyone except admins and the service role.
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Admin activity log: admins read it, the service role writes it.
drop policy if exists admin_activity_logs_select_admin on public.admin_activity_logs;
create policy admin_activity_logs_select_admin on public.admin_activity_logs
  for select to authenticated
  using (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone, avatar_url, timezone) on public.profiles to authenticated;
grant select on public.admin_activity_logs to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
