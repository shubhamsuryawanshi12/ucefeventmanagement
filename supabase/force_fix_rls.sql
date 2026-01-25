-- FORCE FIX RLS (Drop ALL Profile Policies to kill recursion)
-- Run this ENTIRE script in Supabase SQL Editor

-- 1. Ensure the secure function exists
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role AS $$
DECLARE
    u_role user_role;
BEGIN
    SELECT role INTO u_role FROM public.profiles WHERE id = auth.uid();
    RETURN u_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. NUCLEAR OPTION: Drop ALL policies on profiles to be sure
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Organizers can view participant profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can insert own profile" ON profiles;

-- 3. Re-create SAFE policies
-- A. View Own (Safe)
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- B. Update Own (Safe)
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- C. Admin/Organizer View (Uses Secure Function -> No Recursion)
CREATE POLICY "Staff can view profiles" ON profiles
    FOR SELECT USING (
        public.get_my_role() IN ('organizer', 'admin')
    );

-- D. Insert (Safe)
CREATE POLICY "Anyone can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);


-- 4. Fix Events Recursion (if any)
DROP POLICY IF EXISTS "Organizers can create events" ON events;
DROP POLICY IF EXISTS "Admins can manage all events" ON events;

CREATE POLICY "Organizers can create events" ON events
    FOR INSERT WITH CHECK (
        public.get_my_role() IN ('organizer', 'admin')
    );

CREATE POLICY "Admins can manage all events" ON events
    FOR ALL USING (
        public.get_my_role() = 'admin'
    );

-- Confirmation
SELECT 'RLS Force Fix Applied' as status;
