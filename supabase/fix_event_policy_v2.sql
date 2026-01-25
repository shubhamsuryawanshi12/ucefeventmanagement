-- FIX EVENT CREATION ERROR (V2 - Safe)

-- 1. DROP ALL Potential Conflicts
DROP POLICY IF EXISTS "Organizers can create events" ON events;
DROP POLICY IF EXISTS "Organizers can update own events" ON events;

-- 2. Create Create Policy
CREATE POLICY "Organizers can create events" ON events
    FOR INSERT WITH CHECK (
        organizer_id = auth.uid()
        AND
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role::text IN ('organizer', 'admin')
        )
    );

-- 3. Create Update Policy
CREATE POLICY "Organizers can update own events" ON events
    FOR UPDATE USING (organizer_id = auth.uid());

SELECT 'Event Policy Fixed (Safe)' as status;
