/*
  # Add About Page Images Management

  1. New Tables
    - `about_page_images`
      - `id` (uuid, primary key)
      - `image_key` (text, unique) - identifier for each image slot
      - `image_url` (text) - URL to the image
      - `alt_text` (text) - alt text for accessibility
      - `display_order` (integer) - order for gallery images
      - `updated_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `about_page_images` table
    - Add policy for public read access
    - Add policy for authenticated users to manage images
*/

CREATE TABLE IF NOT EXISTS about_page_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_key text UNIQUE NOT NULL,
  image_url text NOT NULL,
  alt_text text DEFAULT '',
  display_order integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE about_page_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view about page images"
  ON about_page_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert about page images"
  ON about_page_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update about page images"
  ON about_page_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete about page images"
  ON about_page_images
  FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO about_page_images (image_key, image_url, alt_text, display_order) VALUES
  ('hero', '/assets/images/photographer.jpg', 'Hardeep Singh Photography', 0),
  ('story_main', '/assets/images/DSC03847.jpg', 'Photography lifestyle', 0),
  ('gallery_1', '/assets/images/gallery/gallery-1.jpg', 'Wedding moment', 1),
  ('gallery_2', '/assets/images/gallery/gallery-2.jpg', 'Candid moment', 2),
  ('gallery_3', '/assets/images/gallery/gallery-3.jpg', 'Couple portrait', 3),
  ('gallery_4', '/assets/images/gallery/gallery-4.jpg', 'Emotional moment', 4),
  ('wedding_banner', '/assets/images/DSC04213.jpg', 'Beautiful wedding moment', 0)
ON CONFLICT (image_key) DO NOTHING;
