-- Run in the Supabase SQL editor. No public table access is granted.
create table if not exists public.site_content (id text primary key, content jsonb not null, updated_at timestamptz not null default now());
create table if not exists public.leads (
 id uuid primary key default gen_random_uuid(), lead_type text not null check (lead_type in ('invitation','partner')),
 crm_tag text not null, fields jsonb not null, interests jsonb not null default '[]',
 source_page text not null, utm jsonb not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 status text not null, notes text not null default '', owner text not null default '', fingerprint text not null
);
alter table public.site_content enable row level security;
alter table public.leads enable row level security;
revoke all on public.site_content, public.leads from anon, authenticated;
grant all on public.site_content, public.leads to service_role;
create index if not exists leads_created on public.leads(created_at desc);
create index if not exists leads_fingerprint on public.leads(fingerprint,created_at);
create or replace function public.submit_igcs_lead(p_kind text,p_fields jsonb,p_interests jsonb,p_source text,p_utm jsonb,p_fingerprint text)
returns text language plpgsql security definer set search_path=public as $$
begin
 perform pg_advisory_xact_lock(hashtext(p_fingerprint));
 if exists(select 1 from leads where fingerprint=p_fingerprint and lead_type=p_kind and created_at>now()-interval '10 minutes') then return 'rate_limited'; end if;
 insert into leads(lead_type,crm_tag,fields,interests,source_page,utm,status,fingerprint)
 values(p_kind,case when p_kind='partner' then 'IGCS_PARTNER_LEAD' else 'IGCS_INVITATION_REQUEST' end,p_fields,p_interests,p_source,p_utm,case when p_kind='partner' then 'Intro' else 'New' end,p_fingerprint);
 return 'saved';
end $$;
revoke all on function public.submit_igcs_lead(text,jsonb,jsonb,text,jsonb,text) from public,anon,authenticated;
grant execute on function public.submit_igcs_lead(text,jsonb,jsonb,text,jsonb,text) to service_role;
