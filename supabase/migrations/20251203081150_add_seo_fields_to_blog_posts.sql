/*
  # Add SEO Fields to Blog Posts

  ## New Columns Added to blog_posts
  
  1. SEO Fields
    - `seo_title` (text) - Custom SEO title (defaults to post title)
    - `seo_description` (text) - Meta description for search engines
    - `seo_keywords` (text) - Comma-separated keywords
    - `seo_focus_keyword` (text) - Primary focus keyword for SEO
    - `og_title` (text) - Open Graph title for social sharing
    - `og_description` (text) - Open Graph description
    - `og_image` (text) - Open Graph image URL
    - `twitter_title` (text) - Twitter card title
    - `twitter_description` (text) - Twitter card description
    - `canonical_url` (text) - Canonical URL to prevent duplicate content
    - `robots_meta` (text) - Robots meta tag (index/noindex, follow/nofollow)

  ## Notes
  - All SEO fields are optional and will default appropriately
  - If seo_title is not set, regular title will be used
  - If seo_description is not set, excerpt will be used
  - Default robots_meta is 'index, follow'
*/

DO $$
BEGIN
  -- Add seo_title if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'seo_title'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN seo_title text;
  END IF;

  -- Add seo_description if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'seo_description'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN seo_description text;
  END IF;

  -- Add seo_keywords if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'seo_keywords'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN seo_keywords text;
  END IF;

  -- Add seo_focus_keyword if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'seo_focus_keyword'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN seo_focus_keyword text;
  END IF;

  -- Add og_title if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'og_title'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN og_title text;
  END IF;

  -- Add og_description if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'og_description'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN og_description text;
  END IF;

  -- Add og_image if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'og_image'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN og_image text;
  END IF;

  -- Add twitter_title if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'twitter_title'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN twitter_title text;
  END IF;

  -- Add twitter_description if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'twitter_description'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN twitter_description text;
  END IF;

  -- Add canonical_url if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'canonical_url'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN canonical_url text;
  END IF;

  -- Add robots_meta if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'robots_meta'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN robots_meta text DEFAULT 'index, follow';
  END IF;
END $$;