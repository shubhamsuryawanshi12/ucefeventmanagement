-- UCEF Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing types if they exist (for clean install)
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS event_stage CASCADE;
DROP TYPE IF EXISTS event_type CASCADE;
DROP TYPE IF EXISTS participation_status CASCADE;
DROP TYPE IF EXISTS attendance_method CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('student', 'organizer', 'admin');
CREATE TYPE event_stage AS ENUM ('draft', 'published', 'registration_open', 'ongoing', 'completed', 'archived');
CREATE TYPE event_type AS ENUM ('workshop', 'hackathon', 'seminar', 'cultural', 'sports', 'tech_talk', 'other');
CREATE TYPE participation_status AS ENUM ('registered', 'attended', 'contributed', 'certified');
CREATE TYPE attendance_method AS ENUM ('qr', 'manual', 'code', 'gps');

-- Users/Profiles Table (extends Supabase auth.users)
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

-- Events Table
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

-- Participation Table (Core - tracks lifecycle)
CREATE TABLE IF NOT EXISTS participation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status participation_status NOT NULL DEFAULT 'registered',
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    attended_at TIMESTAMPTZ,
    contributed_at TIMESTAMPTZ,
    certified_at TIMESTAMPTZ,
    contribution_score INTEGER DEFAULT 0,
    verification_status BOOLEAN DEFAULT FALSE,
    certificate_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, event_id)
);

-- Contributions Table (task submissions)
CREATE TABLE IF NOT EXISTS contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participation_id UUID NOT NULL REFERENCES participation(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    submission_url TEXT,
    file_url TEXT,
    score INTEGER DEFAULT 0,
    feedback TEXT,
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participation_id UUID NOT NULL REFERENCES participation(id) ON DELETE CASCADE,
    certificate_number TEXT UNIQUE NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    issued_by UUID NOT NULL REFERENCES profiles(id),
    template_type TEXT DEFAULT 'standard',
    pdf_url TEXT,
    is_valid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Tasks Table (pre-event requirements)
CREATE TABLE IF NOT EXISTS event_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    task_type TEXT NOT NULL, -- 'form', 'upload', 'quiz', 'link'
    required BOOLEAN DEFAULT FALSE,
    max_score INTEGER DEFAULT 0,
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_stage ON events(stage);
CREATE INDEX IF NOT EXISTS idx_participation_student ON participation(student_id);
CREATE INDEX IF NOT EXISTS idx_participation_event ON participation(event_id);
CREATE INDEX IF NOT EXISTS idx_participation_status ON participation(status);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tasks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Organizers can view participant profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() AND p.role IN ('organizer', 'admin')
        )
    );

CREATE POLICY "Anyone can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Anyone can view published events" ON events
    FOR SELECT USING (stage != 'draft' OR organizer_id = auth.uid());

CREATE POLICY "Organizers can create events" ON events
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('organizer', 'admin'))
    );

CREATE POLICY "Organizers can update own events" ON events
    FOR UPDATE USING (organizer_id = auth.uid());

CREATE POLICY "Admins can manage all events" ON events
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Participation policies
CREATE POLICY "Students can view own participations" ON participation
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Organizers can view event participations" ON participation
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events e
            WHERE e.id = event_id AND e.organizer_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all participations" ON participation
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Students can register for events" ON participation
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Organizers can update participations" ON participation
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM events e
            WHERE e.id = event_id AND e.organizer_id = auth.uid()
        )
    );

-- Contributions policies
CREATE POLICY "Students can view own contributions" ON contributions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM participation p
            WHERE p.id = participation_id AND p.student_id = auth.uid()
        )
    );

CREATE POLICY "Organizers can view event contributions" ON contributions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM participation p
            JOIN events e ON e.id = p.event_id
            WHERE p.id = participation_id AND e.organizer_id = auth.uid()
        )
    );

CREATE POLICY "Students can create contributions" ON contributions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM participation p
            WHERE p.id = participation_id AND p.student_id = auth.uid()
        )
    );

-- Certificates policies
CREATE POLICY "Anyone can view valid certificates" ON certificates
    FOR SELECT USING (is_valid = TRUE);

CREATE POLICY "Organizers can create certificates" ON certificates
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('organizer', 'admin'))
    );

-- Event Tasks policies
CREATE POLICY "Anyone can view event tasks" ON event_tasks
    FOR SELECT USING (TRUE);

CREATE POLICY "Organizers can manage event tasks" ON event_tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM events e
            WHERE e.id = event_id AND e.organizer_id = auth.uid()
        )
    );

-- Functions

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update event registration count
CREATE OR REPLACE FUNCTION update_registration_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events SET registration_count = registration_count + 1 WHERE id = NEW.event_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events SET registration_count = registration_count - 1 WHERE id = OLD.event_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_participation_change ON participation;
CREATE TRIGGER on_participation_change
    AFTER INSERT OR DELETE ON participation
    FOR EACH ROW EXECUTE FUNCTION update_registration_count();

-- Function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'attended' AND OLD.status = 'registered' THEN
        UPDATE profiles SET total_events_attended = total_events_attended + 1 WHERE id = NEW.student_id;
    END IF;
    IF NEW.contribution_score != OLD.contribution_score THEN
        UPDATE profiles 
        SET total_contribution_score = total_contribution_score + (NEW.contribution_score - OLD.contribution_score)
        WHERE id = NEW.student_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_participation_update ON participation;
CREATE TRIGGER on_participation_update
    AFTER UPDATE ON participation
    FOR EACH ROW EXECUTE FUNCTION update_user_stats();
