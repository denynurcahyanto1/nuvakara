-- Fix admin bootstrap: PostgREST publishes JWT claims as a single
-- `request.jwt.claims` JSON setting, so the legacy singular
-- `request.jwt.claim.role` check never matched and the service role could
-- never promote the bootstrap admin (ADMIN_EMAILS).
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  claims_role text;
  effective_role text;
begin
  claims_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'
  );

  effective_role := coalesce(claims_role, current_user::text);

  if (new.role is distinct from old.role) or (new.status is distinct from old.status) then
    if effective_role <> 'service_role'
       and effective_role not in ('postgres', 'supabase_admin')
       and not public.is_admin() then
      raise exception 'role and status can only be changed by an administrator';
    end if;
  end if;

  return new;
end;
$$;
