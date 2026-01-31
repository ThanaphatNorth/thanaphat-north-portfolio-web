-- ============================================
-- Portfolio Contact Form - Supabase Setup
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. CREATE CONTACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  service TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_read ON contacts(read);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 4. DROP EXISTING POLICIES (if re-running)
-- ============================================
DROP POLICY IF EXISTS "Allow anonymous inserts" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated users to read" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON contacts;

-- 5. CREATE RLS POLICIES
-- ============================================

-- Policy: Allow anonymous users to INSERT (for contact form submissions)
CREATE POLICY "Allow anonymous inserts" ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users FULL access (for admin dashboard)
CREATE POLICY "Allow authenticated users full access" ON contacts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. CREATE VIEW FOR UNREAD CONTACTS (optional)
-- ============================================
CREATE OR REPLACE VIEW unread_contacts AS
SELECT * FROM contacts WHERE read = FALSE ORDER BY created_at DESC;
