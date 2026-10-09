-- Run this script once in Supabase SQL Editor.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'student' check (role in ('student','teacher')),
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id bigint generated always as identity primary key,
  grade text not null check (grade in ('prep1','prep2','prep3','sec1','sec2','sec3')),
  subject text not null,
  title text not null,
  description text not null,
  lesson_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.student_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id bigint not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.student_progress enable row level security;

create or replace function public.is_teacher()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'teacher') $$;

create policy "profile owner can read" on public.profiles for select using (auth.uid() = id);
create policy "students read published lessons" on public.lessons for select using (published = true or public.is_teacher());
create policy "teachers manage lessons" on public.lessons for all using (public.is_teacher()) with check (public.is_teacher());
create policy "students manage own progress" on public.student_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.profiles (id,email,role)
select id,email,case when lower(email)='verb9004@gmail.com' then 'teacher' else 'student' end
from auth.users
on conflict (id) do update set role=excluded.role,email=excluded.email;

insert into public.lessons (grade,subject,title,description,lesson_url,published)
select 'sec2','فيزياء','القياس الفيزيائي','شرح الدرس الأول مع مذكرة ورسوم وأمثلة محلولة.','lesson1.html',true
where not exists (select 1 from public.lessons where grade='sec2' and title='القياس الفيزيائي');

insert into public.lessons (grade,subject,title,description,lesson_url,published)
select 'sec2','فيزياء','الحركة والسرعة','شرح الدرس الأول من الفصل الثاني مع مذكرة PDF واختبار.','lesson2.html',true
where not exists (select 1 from public.lessons where grade='sec2' and title='الحركة والسرعة');

