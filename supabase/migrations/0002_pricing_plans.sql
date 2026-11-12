-- NUVAKARA — 0002: pricing plans.
--
-- The catalogue is admin-editable (Phase 6 UI), but the table and the seeded
-- free plan land here because the public landing page already reads it.
--
-- Applied by scripts/apply-migrations.mjs. Idempotent: safe to re-run.

create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  price numeric(12, 2) not null default 0,
  currency text not null default 'IDR',
  billing_period text not null default 'monthly'
    check (billing_period in ('monthly', 'yearly', 'one-time')),
  duration_days integer,
  features text[] not null default '{}',
  max_invitations integer not null default 1,
  allow_premium_templates boolean not null default false,
  is_premium boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pricing_plans_active_sort_idx
  on public.pricing_plans (is_active, sort_order);

drop trigger if exists pricing_plans_set_updated_at on public.pricing_plans;
create trigger pricing_plans_set_updated_at
  before update on public.pricing_plans
  for each row execute function public.set_updated_at();

alter table public.pricing_plans enable row level security;

-- Anyone may read an active plan; writes are admin-only (service role in the
-- application layer, admins through the admin client).
drop policy if exists pricing_plans_select_active on public.pricing_plans;
create policy pricing_plans_select_active on public.pricing_plans
  for select to anon, authenticated
  using (is_active or public.is_admin());

drop policy if exists pricing_plans_admin_all on public.pricing_plans;
create policy pricing_plans_admin_all on public.pricing_plans
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.pricing_plans to anon, authenticated;

-- The free tier every new account starts on.
insert into public.pricing_plans (
  slug, name, description, price, currency, billing_period, duration_days,
  features, max_invitations, allow_premium_templates, is_premium, is_active, sort_order
)
values (
  'gratis',
  'Gratis',
  'Satu undangan aktif, seluruh fitur dasar, tanpa biaya.',
  0,
  'IDR',
  'monthly',
  null,
  array[
    '1 undangan aktif',
    'Template premium',
    'RSVP & guestbook',
    'Statistik pengunjung',
    'Berbagi via WhatsApp'
  ],
  1,
  false,
  false,
  true,
  0
)
on conflict (slug) do nothing;
