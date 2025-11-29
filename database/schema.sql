-- ================================================
-- TABLE: PROFILES
-- Relacionada 1-1 com auth.users (id = uuid)
-- ================================================
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    document_number text,
    date_of_birth date,
    gender text,
    mom_full_name text,
    address text,
    nationality text,
    priority boolean default false,
    role text,

    inserted_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Atualiza automaticamente o updated_at
create trigger update_profiles_timestamp
before update on public.profiles
for each row
execute procedure public.set_updated_at();


-- ================================================
-- TABLE: QUEUE
-- Fila de atendimento
-- ================================================
create table public.queue (
    id uuid primary key default gen_random_uuid(),

    checkin timestamp with time zone not null,
    profile_id uuid not null references public.profiles(id) on delete cascade,

    status text not null,  -- ex: waiting, in_progress, finished

    assigned_doctor_id uuid references public.profiles(id) on delete set null,

    inserted_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create trigger update_queue_timestamp
before update on public.queue
for each row
execute procedure public.set_updated_at();


-- ================================================
-- TABLE: RECORD_MEDICAL
-- Registro médico com relação médico/paciente
-- ================================================
create table public.record_medical (
    id bigserial primary key,

    doctor_id uuid not null references public.profiles(id) on delete set null,
    patient_id uuid not null references public.profiles(id) on delete cascade,

    started_at timestamp with time zone not null,
    end_at timestamp with time zone,

    subjective text,
    objective_data text,
    assessment text,
    planning text,

    inserted_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create trigger update_record_medical_timestamp
before update on public.record_medical
for each row
execute procedure public.set_updated_at();
