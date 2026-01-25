-- DIAGNOSE & FIX EVENT CREATION
-- Run this to see who you are and fix permission.

-- 1. Check your Role (Look at the "Results" tab after running)
SELECT id, email, role FROM profiles WHERE id = auth.uid();

-- 2. FORCE FIX POLICY to use Security Definer Function (Avoids RLS bugs)
DROP POLICY IF EXISTS "Organizers can create events" ON events;
DROP POLICY IF EXISTS "Organizers can update own events" ON events;
DROP POLICY IF EXISTS "Organizers can create events v2" ON events;

CREATE POLICY "Organizers can create events" ON events
    FOR INSERT WITH CHECK (
        -- Trust the secure function
        public.get_my_role() IN ('organizer', 'admin')
        AND
        organizer_id = auth.uid()
    );

CREATE POLICY "Organizers can update own events" ON events
    FOR UPDATE USING (
        public.get_my_role() IN ('organizer', 'admin')
        AND
        organizer_id = auth.uid()
    );

SELECT 'Policy Updated. Your Role is listed above.' as status;
