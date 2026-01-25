-- FIX PARTICIPATION RLS (Allow Organizers to Mark Attendance)

-- 1. DROP Restrictive Policies
DROP POLICY IF EXISTS "Organizers can manage participation" ON participation;
DROP POLICY IF EXISTS "Users can view own participation" ON participation;
DROP POLICY IF EXISTS "Organizers can view managed participation" ON participation;

-- 2. Create Simple Open Policy for Staff
-- "Staff can do ANYTHING on participation table"
CREATE POLICY "Staff can manage participation" ON participation
    FOR ALL USING (
        public.get_my_role() IN ('organizer', 'admin')
    );

-- 3. Allow Students to View their own records
CREATE POLICY "Students can view own participation" ON participation
    FOR SELECT USING (
        auth.uid() = student_id
    );

-- 4. Allow Students to Insert (Register) themselves
CREATE POLICY "Students can register themselves" ON participation
    FOR INSERT WITH CHECK (
        auth.uid() = student_id
    );

SELECT 'Participation RLS Fixed' as status;
