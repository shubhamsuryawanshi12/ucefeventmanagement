-- PROMOTE TO ORGANIZER (Manual Fix)
-- Run this to force your account to be an Organizer.

-- REPLACE 'your_email@example.com' WITH YOUR ACTUAL EMAIL
UPDATE profiles
SET role = 'organizer'
WHERE email = 'Place_Your_Email_Here';  -- <--- EDIT THIS LINE

-- Verify the change
SELECT email, role FROM profiles WHERE email = 'Place_Your_Email_Here'; -- <--- AND THIS LINE
