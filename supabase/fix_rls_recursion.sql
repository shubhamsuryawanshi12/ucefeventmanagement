-- FIX 500 ERROR (Infinite Recursion in RLS)
-- Run this in Supabase SQL Editor

-- 1. Create a secure function to check role without triggering RLS loop
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role AS $$
DECLARE
    u_role user_role;
BEGIN
    SELECT role INTO u_role FROM public.profiles WHERE id = auth.uid();
    RETURN u_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- <--- Critical: By-pass RLS

-- 2. Drop existing problematic policies on profiles
DROP POLICY IF EXISTS "Organizers can view participant profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- 3. Re-create policies using the secure function
-- Policy A: View own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Policy B: Organizers can view others (using secure function)
CREATE POLICY "Organizers can view participant profiles" ON profiles
    FOR SELECT USING (
        public.get_my_role() IN ('organizer', 'admin')
    );

-- Policy C: Admins (redundant if included above, but separate for clarity)
-- Included above.

-- 4. Fix Events Policy (Same logic)
DROP POLICY IF EXISTS "Organizers can create events" ON events;
CREATE POLICY "Organizers can create events" ON events
    FOR INSERT WITH CHECK (
        public.get_my_role() IN ('organizer', 'admin')
    );

-- Confirmation
SELECT 'RLS Fix Applied Successfully' as status;
