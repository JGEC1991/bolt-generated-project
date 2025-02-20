-- Enable Row Level Security (RLS) on the 'profiles' table
alter table profiles enable row level security;

-- Create policy to allow authenticated users to SELECT their own profile
create policy "Allow authenticated users to SELECT their own profile" on profiles
for select
using (auth.uid() = id);

-- Create policy to allow authenticated users to UPDATE their own profile
create policy "Allow authenticated users to UPDATE their own profile" on profiles
for update
using (auth.uid() = id);

-- Create policy to allow authenticated users to INSERT their own profile
create policy "Allow authenticated users to INSERT their own profile" on profiles
for insert
with check (auth.uid() = id);

-- Create policy to allow admins to UPDATE profiles
create policy "Allow admins to UPDATE profiles" on profiles
for update
using (is_admin = true);
