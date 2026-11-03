create table if not exists public.site_content (
  site_key text primary key check (site_key = 'awadh'),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
revoke all on table public.site_content from anon, authenticated;
grant select, insert, update on table public.site_content to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('awadh-media', 'awadh-media', true, 8388608, array['image/webp']::text[])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
