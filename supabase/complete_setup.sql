-- COMPLETE UCEF DATABASE SETUP & FIX
-- Run this entire script in Supabase SQL Editor.

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Define Enums (Safe Operation)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'organizer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_stage AS ENUM ('draft', 'published', 'registration_open', 'ongoing', 'completed', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_type AS ENUM ('workshop', 'hackathon', 'seminar', 'cultural', 'sports', 'tech_talk', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE participation_status AS ENUM ('registered', 'attended', 'contributed', 'certified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_method AS ENUM ('qr', 'manual', 'code', 'gps');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Ensure Tables Exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    department TEXT,
    student_id TEXT,
    phone TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    total_events_attended INTEGER DEFAULT 0,
    total_contribution_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    event_type event_type NOT NULL DEFAULT 'other',
    stage event_stage NOT NULL DEFAULT 'draft',
    organizer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    venue TEXT,
    capacity INTEGER,
    registration_count INTEGER DEFAULT 0,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    registration_deadline TIMESTAMPTZ,
    attendance_method attendance_method DEFAULT 'manual',
    attendance_code TEXT,
    banner_url TEXT,
    tags TEXT[],
    requirements TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS participation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status participation_status NOT NULL DEFAULT 'registered',
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    attended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, event_id)
);

-- 4. Enable RLS (Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participation ENABLE ROW LEVEL SECURITY;

-- 5. Drop Old Policies (to avoid duplicates if re-running)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can insert own profile" ON profiles;
-- Re-create generic permissive policies for testing if strict ones fail
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Anyone can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. CRITICAL: Fix the User Creation Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    u_role user_role;
BEGIN
    -- Fallback safety for role casting
    BEGIN
        u_role := (NEW.raw_user_meta_data->>'role')::user_role;
    EXCEPTION WHEN OTHERS THEN
        u_role := 'student';
    END;

    IF u_role IS NULL THEN
        u_role := 'student';
    END IF;

    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        u_role
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Confirmation
SELECT 'Database Setup Completed Successfully' as status;
