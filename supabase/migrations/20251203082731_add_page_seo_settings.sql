/*
  # Add Page SEO Settings Table

  1. New Tables
    - `page_seo_settings`
      - `id` (uuid, primary key)
      - `page_slug` (text, unique) - Identifier for each page (home, about, contact, stories)
      - `page_name` (text) - Display name for the page
      - `seo_title` (text) - Custom SEO title
      - `meta_description` (text) - Meta description
      - `keywords` (text) - Comma-separated keywords
      - `canonical_url` (text) - Canonical URL
      - `robots_meta` (text) - Robots meta tag value
      - `og_title` (text) - Open Graph title
      - `og_description` (text) - Open Graph description
      - `og_image` (text) - Open Graph image URL
      - `og_type` (text) - Open Graph type
      - `twitter_card` (text) - Twitter card type
      - `twitter_title` (text) - Twitter card title
      - `twitter_description` (text) - Twitter card description
      - `twitter_image` (text) - Twitter card image URL
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `page_seo_settings` table
    - Add policy for public to read SEO settings
    - Add policy for authenticated users to manage SEO settings

  3. Initial Data
    - Insert default SEO settings for main pages (home, about, contact, stories)
*/

CREATE TABLE IF NOT EXISTS page_seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text UNIQUE NOT NULL,
  page_name text NOT NULL,
  seo_title text,
  meta_description text,
  keywords text,
  canonical_url text,
  robots_meta text DEFAULT 'index, follow',
  og_title text,
  og_description text,
  og_image text,
  og_type text DEFAULT 'website',
  twitter_card text DEFAULT 'summary_large_image',
  twitter_title text,
  twitter_description text,
  twitter_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE page_seo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view page SEO settings"
  ON page_seo_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert page SEO settings"
  ON page_seo_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update page SEO settings"
  ON page_seo_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete page SEO settings"
  ON page_seo_settings
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default SEO settings for main pages
INSERT INTO page_seo_settings (page_slug, page_name, seo_title, meta_description, robots_meta, og_type, twitter_card)
VALUES 
  ('home', 'Home Page', 'Professional Photography Services', 'Capturing life''s precious moments with artistic excellence and professional expertise.', 'index, follow', 'website', 'summary_large_image'),
  ('about', 'About Page', 'About Our Photography Studio', 'Learn about our passion for photography and our commitment to capturing your special moments.', 'index, follow', 'website', 'summary_large_image'),
  ('contact', 'Contact Page', 'Contact Us - Get In Touch', 'Ready to book your photography session? Contact us today to discuss your needs.', 'index, follow', 'website', 'summary_large_image'),
  ('stories', 'Stories Page', 'Our Photography Portfolio', 'Explore our collection of stunning photography projects and client stories.', 'index, follow', 'website', 'summary_large_image')
ON CONFLICT (page_slug) DO NOTHING;