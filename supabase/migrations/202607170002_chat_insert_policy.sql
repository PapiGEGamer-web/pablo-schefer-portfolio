begin;

grant insert on public.chat_messages to authenticated;

drop policy if exists "Account holders write own chat messages" on public.chat_messages;
create policy "Account holders write own chat messages"
  on public.chat_messages
  for insert
  to authenticated
  with check (auth.uid() = user_id);

commit;
