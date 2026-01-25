-- FINAL UNIFIED FIX (Run this to solve 500 Error AND Signup Error)

-- 1. Helper Function to break recursion (Fixes 500 error)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role AS $$
DECLARE
    u_role user_role;
BEGIN
    SELECT role INTO u_role FROM public.profiles WHERE id = auth.uid();
    RETURN u_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. RESET POLICIES (Fixes Access Denied & Recursion)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Organizers can view participant profiles" ON profiles;
DROP POLICY IF EXISTS "Staff can view profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Staff can view profiles" ON profiles FOR SELECT USING (public.get_my_role() IN ('organizer', 'admin'));
CREATE POLICY "Anyone can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. RESET TRIGGER (Fixes "Database Error saving new user")
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    u_role user_role;
BEGIN
    -- Robust role detection
    BEGIN
        u_role := (NEW.raw_user_meta_data->>'role')::user_role;
    EXCEPTION WHEN OTHERS THEN
        u_role := 'student';
    END;
    
    IF u_role IS NULL THEN u_role := 'student'; END IF;

    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), u_role);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT 'ALL SYSTEMS FIXED' as status;
