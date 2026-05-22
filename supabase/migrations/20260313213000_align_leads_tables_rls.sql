begin;

do $$
declare
  target_table text;
  policy_record record;
begin
  foreach target_table in array array['leads'] loop
    execute format('alter table if exists public.%I enable row level security', target_table);
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

    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = target_table
        and column_name = 'name'
    ) and not exists (
      select 1
      from pg_constraint
      where conname = target_table || '_name_length_chk'
    ) then
      execute format(
        'alter table public.%I add constraint %I check (char_length(name) between 1 and 100)',
        target_table,
        target_table || '_name_length_chk'
      );
    end if;

    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = target_table
        and column_name = 'company'
    ) and not exists (
      select 1
      from pg_constraint
      where conname = target_table || '_company_length_chk'
    ) then
      execute format(
        'alter table public.%I add constraint %I check (company is null or char_length(company) <= 100)',
        target_table,
        target_table || '_company_length_chk'
      );
    end if;

    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = target_table
        and column_name = 'message'
    ) and not exists (
      select 1
      from pg_constraint
      where conname = target_table || '_message_length_chk'
    ) then
      execute format(
        'alter table public.%I add constraint %I check (char_length(message) between 1 and 2000)',
        target_table,
        target_table || '_message_length_chk'
      );
    end if;
  end loop;
end $$;

commit;
