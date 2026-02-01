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

-- ============================================
-- Blog Posts Table - Supabase Setup
-- ============================================

-- 7. CREATE BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  read_time INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- 8. CREATE INDEXES FOR BLOG POSTS
-- ============================================
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);

-- 9. ENABLE RLS FOR BLOG POSTS
-- ============================================
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 10. DROP EXISTING BLOG POLICIES (if re-running)
-- ============================================
DROP POLICY IF EXISTS "Allow public to read published posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users full access to blog" ON blog_posts;

-- 11. CREATE RLS POLICIES FOR BLOG POSTS
-- ============================================

-- Policy: Allow anyone to read published posts
CREATE POLICY "Allow public to read published posts" ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE);

-- Policy: Allow authenticated users FULL access (for admin)
CREATE POLICY "Allow authenticated users full access to blog" ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 12. CREATE FUNCTION TO AUTO-UPDATE updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. CREATE TRIGGER FOR updated_at
-- ============================================
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 14. CREATE VIEW FOR PUBLISHED POSTS (optional)
-- ============================================
CREATE OR REPLACE VIEW published_posts AS
SELECT * FROM blog_posts WHERE published = TRUE ORDER BY published_at DESC;

-- ============================================
-- Storage Setup for Blog Images
-- ============================================

-- 15. CREATE STORAGE BUCKET FOR BLOG IMAGES
-- Run this in Supabase Dashboard > Storage > Create new bucket
-- Bucket name: blog-images
-- Public bucket: Yes (so images can be viewed by anyone)

-- 16. STORAGE POLICIES (run in SQL Editor)
-- ============================================

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

-- Allow authenticated users to update their uploads
CREATE POLICY "Allow authenticated updates" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated deletes" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images');

-- Allow public read access to blog images
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'blog-images');

-- ============================================
-- Ventures Table - Supabase Setup
-- ============================================

-- 17. CREATE VENTURES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ventures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Coming Soon',
  icon TEXT DEFAULT 'Rocket',
  display_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. CREATE INDEXES FOR VENTURES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_ventures_display_order ON ventures(display_order);
CREATE INDEX IF NOT EXISTS idx_ventures_visible ON ventures(visible);
CREATE INDEX IF NOT EXISTS idx_ventures_status ON ventures(status);

-- 19. ENABLE RLS FOR VENTURES
-- ============================================
ALTER TABLE ventures ENABLE ROW LEVEL SECURITY;

-- 20. DROP EXISTING VENTURES POLICIES (if re-running)
-- ============================================
DROP POLICY IF EXISTS "Allow public to read visible ventures" ON ventures;
DROP POLICY IF EXISTS "Allow authenticated users full access to ventures" ON ventures;

-- 21. CREATE RLS POLICIES FOR VENTURES
-- ============================================

-- Policy: Allow anyone to read visible ventures
CREATE POLICY "Allow public to read visible ventures" ON ventures
  FOR SELECT
  TO anon, authenticated
  USING (visible = TRUE);

-- Policy: Allow authenticated users FULL access (for admin)
CREATE POLICY "Allow authenticated users full access to ventures" ON ventures
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 22. CREATE TRIGGER FOR ventures updated_at
-- ============================================
DROP TRIGGER IF EXISTS update_ventures_updated_at ON ventures;
CREATE TRIGGER update_ventures_updated_at
  BEFORE UPDATE ON ventures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 23. INSERT DEFAULT VENTURES DATA (optional - run once)
-- ============================================
-- INSERT INTO ventures (name, tagline, description, url, status, icon, display_order, visible) VALUES
-- ('JongQue.com', 'SaaS for Resource & Queue Management', 'A comprehensive platform for managing bookings, queues, and resources for businesses of all sizes.', 'https://jongque.com', 'Live', 'Rocket', 1, TRUE),
-- ('BuildYourThinks.com', 'Startup Ideas & Founder Matchmaking', 'A platform connecting aspiring founders with ideas and co-founders to build the next big thing.', 'https://buildyourthinks.com', 'Beta', 'Sparkles', 2, TRUE),
-- ('Visibr.com', 'Tech Blog & Knowledge Hub', 'Sharing insights on software architecture, engineering leadership, and technology trends.', 'https://visibr.com', 'Live', 'BookOpen', 3, TRUE);
