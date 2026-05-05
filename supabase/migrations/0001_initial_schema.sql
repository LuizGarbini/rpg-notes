create extension if not exists "pgcrypto";

create table if not exists public.campaigns (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
	name text not null default 'Minha campanha',
	description text not null default '',
	data jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.characters (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
	campaign_id uuid references public.campaigns(id) on delete set null,
	name text not null default '',
	system text not null default 'generic',
	data jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.npcs (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
	campaign_id uuid references public.campaigns(id) on delete set null,
	name text not null default '',
	importance text not null default 'supporting',
	data jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.sessions (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
	campaign_id uuid references public.campaigns(id) on delete set null,
	title text not null default '',
	session_number integer not null default 1,
	session_date text not null default '',
	data jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.items (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
	campaign_id uuid references public.campaigns(id) on delete set null,
	name text not null default '',
	item_type text not null default '',
	rarity text not null default 'comum',
	data jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.locations (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
	campaign_id uuid references public.campaigns(id) on delete set null,
	name text not null default '',
	location_type text not null default '',
	region text not null default '',
	data jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.lores (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
	campaign_id uuid references public.campaigns(id) on delete set null,
	title text not null default '',
	category text not null default '',
	importance text not null default 'supporting',
	is_secret boolean not null default false,
	data jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.activity_log (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
	campaign_id uuid references public.campaigns(id) on delete set null,
	action text not null check (action in ('create', 'update', 'delete')),
	entity_kind text not null check (entity_kind in ('character', 'npc', 'session', 'item', 'location', 'lore')),
	entity_id uuid not null,
	entity_name text not null default 'Sem nome',
	created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

drop trigger if exists campaigns_set_updated_at on public.campaigns;
create trigger campaigns_set_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

drop trigger if exists characters_set_updated_at on public.characters;
create trigger characters_set_updated_at
before update on public.characters
for each row execute function public.set_updated_at();

drop trigger if exists npcs_set_updated_at on public.npcs;
create trigger npcs_set_updated_at
before update on public.npcs
for each row execute function public.set_updated_at();

drop trigger if exists sessions_set_updated_at on public.sessions;
create trigger sessions_set_updated_at
before update on public.sessions
for each row execute function public.set_updated_at();

drop trigger if exists items_set_updated_at on public.items;
create trigger items_set_updated_at
before update on public.items
for each row execute function public.set_updated_at();

drop trigger if exists locations_set_updated_at on public.locations;
create trigger locations_set_updated_at
before update on public.locations
for each row execute function public.set_updated_at();

drop trigger if exists lores_set_updated_at on public.lores;
create trigger lores_set_updated_at
before update on public.lores
for each row execute function public.set_updated_at();

create index if not exists campaigns_user_id_idx on public.campaigns(user_id);
create index if not exists characters_user_id_updated_at_idx on public.characters(user_id, updated_at desc);
create index if not exists characters_user_id_name_idx on public.characters(user_id, name);
create index if not exists npcs_user_id_updated_at_idx on public.npcs(user_id, updated_at desc);
create index if not exists sessions_user_id_updated_at_idx on public.sessions(user_id, updated_at desc);
create index if not exists items_user_id_updated_at_idx on public.items(user_id, updated_at desc);
create index if not exists locations_user_id_updated_at_idx on public.locations(user_id, updated_at desc);
create index if not exists lores_user_id_updated_at_idx on public.lores(user_id, updated_at desc);
create index if not exists activity_log_user_id_created_at_idx on public.activity_log(user_id, created_at desc);

alter table public.campaigns enable row level security;
alter table public.characters enable row level security;
alter table public.npcs enable row level security;
alter table public.sessions enable row level security;
alter table public.items enable row level security;
alter table public.locations enable row level security;
alter table public.lores enable row level security;
alter table public.activity_log enable row level security;

drop policy if exists "Users manage own campaigns" on public.campaigns;
create policy "Users manage own campaigns" on public.campaigns
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users manage own characters" on public.characters;
create policy "Users manage own characters" on public.characters
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users manage own npcs" on public.npcs;
create policy "Users manage own npcs" on public.npcs
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users manage own sessions" on public.sessions;
create policy "Users manage own sessions" on public.sessions
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users manage own items" on public.items;
create policy "Users manage own items" on public.items
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users manage own locations" on public.locations;
create policy "Users manage own locations" on public.locations
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users manage own lores" on public.lores;
create policy "Users manage own lores" on public.lores
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users manage own activity" on public.activity_log;
create policy "Users manage own activity" on public.activity_log
for all using (user_id = auth.uid()) with check (user_id = auth.uid());
