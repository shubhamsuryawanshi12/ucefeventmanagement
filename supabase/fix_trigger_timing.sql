-- FIX TRIGGER TIMING (The 'Database Error' Cause)

-- 1. Drop the incorrect BEFORE trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Create the correct AFTER trigger
-- (Foreign Key requires User to exist first!)
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT 'Trigger Timing Fixed. Signup will work now.' as status;
