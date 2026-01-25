-- CLEAN SLATE FIX (Run this to fix "Policy Already Exists" and "Database Error")

-- 1. Helper Function
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role AS $$
DECLARE u_role user_role;
BEGIN SELECT role INTO u_role FROM public.profiles WHERE id = auth.uid(); RETURN u_role; END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. DROP ALL POTENTIAL CONFLICTS FIRST
DROP POLICY IF EXISTS "Staff can view profiles" ON profiles;
DROP POLICY IF EXISTS "Organizers can view participant profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Organizers can create events" ON events;

-- 3. RECREATE POLICIES (Safe Versions)
CREATE POLICY "Staff can view profiles" ON profiles 
    FOR SELECT USING (public.get_my_role() IN ('organizer', 'admin'));

CREATE POLICY "Organizers can create events" ON events
    FOR INSERT WITH CHECK (public.get_my_role() IN ('organizer', 'admin'));

-- 4. FIX TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE u_role user_role;
BEGIN
    BEGIN u_role := (NEW.raw_user_meta_data->>'role')::user_role;
    EXCEPTION WHEN OTHERS THEN u_role := 'student'; END;
    IF u_role IS NULL THEN u_role := 'student'; END IF;

    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), u_role);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created BEFORE INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT 'Fixed. You can now Sign Up.' as status;
