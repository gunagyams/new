/*
  # Update Projects and Blog Tables for Admin Panel

  ## Changes to Projects Table
  
  1. Add New Columns
    - `gallery_url` (text) - External gallery link (Google Photos, Dropbox, etc.)
    - `thumbnail_url` (text) - Single compressed thumbnail image URL
    - `access_code` (text, nullable) - Password for locked galleries
    - `is_locked` (boolean, default false) - Controls if gallery requires password
  
  2. Rename Column
    - `cover_image_url` → `thumbnail_url` (semantic rename for clarity)
  
  ## Changes to Blog Posts Table
  
  1. Add New Columns
    - `slug` (text, unique) - URL-friendly identifier for blog posts
    - `published_at` (timestamptz) - Explicit publish date
  
  ## Security
    - Maintain existing RLS policies
    - All new columns follow existing security patterns
*/

-- Update projects table
DO $$
BEGIN
  -- Add gallery_url if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'gallery_url'
  ) THEN
    ALTER TABLE projects ADD COLUMN gallery_url text;
  END IF;

  -- Add thumbnail_url if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'thumbnail_url'
  ) THEN
    ALTER TABLE projects ADD COLUMN thumbnail_url text;
  END IF;

  -- Add access_code if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'access_code'
  ) THEN
    ALTER TABLE projects ADD COLUMN access_code text;
  END IF;

  -- Add is_locked if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'is_locked'
  ) THEN
    ALTER TABLE projects ADD COLUMN is_locked boolean DEFAULT false;
  END IF;
END $$;

-- Copy data from cover_image_url to thumbnail_url if thumbnail_url is empty
UPDATE projects 
SET thumbnail_url = cover_image_url 
WHERE thumbnail_url IS NULL AND cover_image_url IS NOT NULL;

-- Update blog_posts table
DO $$
BEGIN
  -- Add slug if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'slug'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN slug text UNIQUE;
  END IF;

  -- Add published_at if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'published_at'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN published_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Generate slugs for existing blog posts (if any exist without slugs)
UPDATE blog_posts 
SET slug = lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published, created_at DESC);