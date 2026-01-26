/*
  # Create Section Backgrounds Table

  1. New Tables
    - `section_backgrounds`
      - `id` (uuid, primary key)
      - `section_key` (text, unique) - Identifier for the section (e.g., 'services', 'hero', 'about')
      - `media_url` (text, nullable) - URL to background image/video
      - `media_type` (text, nullable) - Type: 'image' or 'video'
      - `overlay_opacity` (numeric) - Opacity of dark overlay (0-1)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `section_backgrounds` table
    - Add policy for public read access
    - Add policy for authenticated users to manage backgrounds
*/

CREATE TABLE IF NOT EXISTS section_backgrounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  media_url text,
  media_type text CHECK (media_type IN ('image', 'video')),
  overlay_opacity numeric DEFAULT 0.5 CHECK (overlay_opacity >= 0 AND overlay_opacity <= 1),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE section_backgrounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view section backgrounds"
  ON section_backgrounds
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert section backgrounds"
  ON section_backgrounds
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update section backgrounds"
  ON section_backgrounds
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete section backgrounds"
  ON section_backgrounds
  FOR DELETE
  TO authenticated
  USING (true);