-- Run this in Supabase SQL Editor to fix the user creation error

-- 1. Ensure Enum Exists (safe check)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'organizer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Drop the trigger to reset
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Redefine the function with better safety
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    u_role user_role;
BEGIN
    -- Attempt to cast role, default to student if fails or null
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

-- 4. Re-attach the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
