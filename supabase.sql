create table messages (id text primary key, ts bigint, name text, email text, phone text, type text, body text, read boolean default false);
create table reviews  (id text primary key, ts bigint, name text, rating int, text text, approved boolean default false);
create table updates  (id text primary key, ts bigint, title text, body text);
alter table messages enable row level security;
alter table reviews enable row level security;
alter table updates enable row level security;
-- visitors can send messages and reviews, and read approved reviews + updates
create policy "send message" on messages for insert to anon with check (true);
create policy "send review" on reviews for insert to anon with check (approved = false);
create policy "read approved reviews" on reviews for select to anon using (approved = true);
create policy "read updates" on updates for select to anon using (true);
-- the signed-in owner (create the user under Authentication > Users) can do everything
create policy "owner messages" on messages for all to authenticated using (true) with check (true);
create policy "owner reviews" on reviews for all to authenticated using (true) with check (true);
create policy "owner updates" on updates for all to authenticated using (true) with check (true);
alter publication supabase_realtime add table messages, reviews, updates;
