begin;

create extension if not exists pgcrypto;

do $$
declare
  target_table text;
  policy_record record;
begin
  foreach target_table in array array['leads', 'leads_demo', 'leads_dev'] loop
    execute format(
      'create table if not exists public.%I (
        id uuid primary key default gen_random_uuid(),
        created_at timestamptz not null default now(),
        name text not null,
        email text not null,
        company text,
        role text,
        phone text,
        message text,
        service_interest text,
        source text default ''landing'',
        locale text,
        status text default ''new'',
        metadata jsonb not null default ''{}''::jsonb
      )',
      target_table
    );

    execute format('alter table public.%I add column if not exists id uuid default gen_random_uuid()', target_table);
    execute format('alter table public.%I add column if not exists created_at timestamptz not null default now()', target_table);
    execute format('alter table public.%I add column if not exists name text', target_table);
    execute format('alter table public.%I add column if not exists email text', target_table);
    execute format('alter table public.%I add column if not exists company text', target_table);
    execute format('alter table public.%I add column if not exists role text', target_table);
    execute format('alter table public.%I add column if not exists phone text', target_table);
    execute format('alter table public.%I add column if not exists message text', target_table);
    execute format('alter table public.%I add column if not exists service_interest text', target_table);
    execute format('alter table public.%I add column if not exists source text default ''landing''', target_table);
    execute format('alter table public.%I add column if not exists locale text', target_table);
    execute format('alter table public.%I add column if not exists status text default ''new''', target_table);
    execute format('alter table public.%I add column if not exists metadata jsonb not null default ''{}''::jsonb', target_table);

    execute format('alter table public.%I alter column name set not null', target_table);
    execute format('alter table public.%I alter column email set not null', target_table);
    execute format('alter table public.%I alter column metadata set default ''{}''::jsonb', target_table);
    execute format('alter table public.%I alter column source set default ''landing''', target_table);
    execute format('alter table public.%I alter column status set default ''new''', target_table);

    execute format('alter table public.%I enable row level security', target_table);
    execute format('revoke all on table public.%I from anon, authenticated', target_table);

    for policy_record in
      select policyname
      from pg_policies
      where schemaname = 'public'
        and tablename = target_table
    loop
      execute format('drop policy if exists %I on public.%I', policy_record.policyname, target_table);
    end loop;

    execute format(
      'create policy %I on public.%I for all to anon, authenticated using (false) with check (false)',
      target_table || '_deny_anon_authenticated',
      target_table
    );

    execute format('alter table public.%I drop constraint if exists %I', target_table, target_table || '_name_length_chk');
    execute format('alter table public.%I drop constraint if exists %I', target_table, target_table || '_email_length_chk');
    execute format('alter table public.%I drop constraint if exists %I', target_table, target_table || '_message_length_chk');

    if not exists (
      select 1 from pg_constraint where conname = target_table || '_name_length_chk'
    ) then
      execute format(
        'alter table public.%I add constraint %I check (char_length(name) between 2 and 100)',
        target_table,
        target_table || '_name_length_chk'
      );
    end if;

    if not exists (
      select 1 from pg_constraint where conname = target_table || '_email_length_chk'
    ) then
      execute format(
        'alter table public.%I add constraint %I check (char_length(email) between 3 and 254)',
        target_table,
        target_table || '_email_length_chk'
      );
    end if;

    if not exists (
      select 1 from pg_constraint where conname = target_table || '_message_length_chk'
    ) then
      execute format(
        'alter table public.%I add constraint %I check (char_length(message) between 10 and 2000)',
        target_table,
        target_table || '_message_length_chk'
      );
    end if;
  end loop;
end $$;

commit;
