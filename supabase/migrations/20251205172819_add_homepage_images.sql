/*
  # Add Homepage Images Table

  1. New Tables
    - `homepage_images`
      - `id` (uuid, primary key)
      - `position` (integer) - Position in the hero grid (0-8 for 9 images)
      - `image_url` (text) - URL to the image in storage
      - `alt_text` (text) - Alt text for accessibility
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `homepage_images` table
    - Add policy for public read access
    - Add policy for authenticated admins to manage images
*/

-- Create homepage_images table
CREATE TABLE IF NOT EXISTS homepage_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position integer NOT NULL UNIQUE CHECK (position >= 0 AND position <= 8),
  image_url text NOT NULL,
  alt_text text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE homepage_images ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view homepage images
CREATE POLICY "Anyone can view homepage images"
  ON homepage_images
  FOR SELECT
  TO public
  USING (true);

-- Policy: Authenticated users can insert homepage images
CREATE POLICY "Authenticated users can insert homepage images"
  ON homepage_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update homepage images
CREATE POLICY "Authenticated users can update homepage images"
  ON homepage_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete homepage images
CREATE POLICY "Authenticated users can delete homepage images"
  ON homepage_images
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default placeholder data for all 9 positions
INSERT INTO homepage_images (position, image_url, alt_text) VALUES
  (0, 'https://picsum.photos/id/1059/600/800', 'Bride styling'),
  (1, 'https://picsum.photos/id/1060/600/900', 'Couple embrace'),
  (2, 'https://picsum.photos/id/1027/600/700', 'Walking away'),
  (3, 'https://picsum.photos/id/338/600/1000', 'Details'),
  (4, 'https://picsum.photos/id/331/600/800', 'Vows'),
  (5, 'https://picsum.photos/id/349/600/900', 'Celebration'),
  (6, 'https://picsum.photos/id/342/600/800', 'Portrait'),
  (7, 'https://picsum.photos/id/325/600/700', 'Forest setting'),
  (8, 'https://picsum.photos/id/433/600/900', 'Candid moment')
ON CONFLICT (position) DO NOTHING;