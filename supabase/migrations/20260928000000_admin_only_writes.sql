-- ============================================================================
-- Admin-only writes
-- ----------------------------------------------------------------------------
-- Before: every write policy was `TO authenticated USING (true)`, so ANY signed-in
-- Supabase user (e.g. someone who self-signs-up with the public anon key) had
-- full CRUD on contacts, blog_posts, ventures, site_settings, portfolios and the
-- image buckets.
-- After: writes require the caller's JWT email to be in public.admin_users.
--
-- Non-destructive: no rows are deleted or modified. Only policies are replaced.
-- Run in the Supabase SQL editor, then:
--   1. INSERT your admin email (step 1 below) BEFORE relying on the dashboard.
--   2. Authentication → Providers → Email → disable "Allow new users to sign up".
-- Rollback: see the bottom of this file.
-- ============================================================================

BEGIN;

-- 1. Allow-list table -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
-- No policies on admin_users: only the service role / SQL editor can read or change it.

INSERT INTO public.admin_users (email)
VALUES ('north.thanaphat@gmail.com')  -- change if your admin login uses another email
ON CONFLICT (email) DO NOTHING;

-- SECURITY DEFINER lets policies consult admin_users without exposing it.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- 2. Tables: replace "authenticated = full access" with "admin = full access" --
DROP POLICY IF EXISTS "Allow authenticated users full access" ON contacts;
CREATE POLICY "Admins full access" ON contacts
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated users full access to blog" ON blog_posts;
CREATE POLICY "Admins full access to blog" ON blog_posts
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated users full access to ventures" ON ventures;
CREATE POLICY "Admins full access to ventures" ON ventures
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated users full access to site settings" ON site_settings;
CREATE POLICY "Admins full access to site settings" ON site_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated users full access to portfolios" ON portfolios;
CREATE POLICY "Admins full access to portfolios" ON portfolios
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. Storage buckets -----------------------------------------------------------
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated portfolio uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated portfolio updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated portfolio deletes" ON storage.objects;

CREATE POLICY "Admin uploads" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('blog-images', 'portfolio-images') AND public.is_admin());
CREATE POLICY "Admin updates" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id IN ('blog-images', 'portfolio-images') AND public.is_admin());
CREATE POLICY "Admin deletes" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('blog-images', 'portfolio-images') AND public.is_admin());

COMMIT;

-- ============================================================================
-- Verify (as a NON-admin signed-in user, e.g. via supabase-js):
--   insert into blog_posts → must fail with "new row violates row-level security"
-- Rollback (restores the old, permissive behaviour):
--   DROP POLICY "Admins full access" ON contacts; CREATE POLICY "Allow authenticated users full access" ON contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
--   ...same pattern for blog_posts, ventures, site_settings, portfolios and the six storage policies.
-- ============================================================================
