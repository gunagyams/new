/*
  # Create Services Management System

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `title` (text) - Service title
      - `description` (text) - Service description
      - `icon_name` (text) - Icon identifier (Camera, Film, Heart, etc.)
      - `media_url` (text, nullable) - URL to uploaded image/video
      - `media_type` (text, nullable) - Type of media: 'image' or 'video'
      - `display_order` (integer) - Order for display
      - `published` (boolean) - Visibility status
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `services` table
    - Add policy for public read access to published services
    - Add policy for authenticated users to manage services
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL DEFAULT 'Camera',
  media_url text,
  media_type text CHECK (media_type IN ('image', 'video')),
  display_order integer NOT NULL DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published services"
  ON services
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Authenticated users can insert services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete services"
  ON services
  FOR DELETE
  TO authenticated
  USING (true);