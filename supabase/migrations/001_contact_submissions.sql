-- Create the contact_submissions table
create table public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  service text not null,
  message text,
  status text default 'New',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.contact_submissions enable row level security;

-- Policy: Allow anonymous users to inert forms
create policy "Allow public inserts" 
on public.contact_submissions for insert 
to anon 
with check (true);

-- Policy: Allow authenticated users (admins) to select all forms
create policy "Allow authenticated selects" 
on public.contact_submissions for select 
to authenticated 
using (true);

-- Policy: Allow authenticated users to update forms (e.g., status)
create policy "Allow authenticated updates" 
on public.contact_submissions for update 
to authenticated 
using (true);
