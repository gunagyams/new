/*
  # Create testimonials table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `quote` (text, the testimonial text)
      - `author` (text, the author/client name or label)
      - `location` (text, where the client is from)
      - `display_order` (integer, for sorting)
      - `published` (boolean, whether visible on site)
      - `created_at` (timestamptz, auto-set)
      - `updated_at` (timestamptz, auto-set)

  2. Security
    - Enable RLS on `testimonials` table
    - Add policy for public read access to published testimonials
    - Add policy for authenticated users to manage testimonials

  3. Seed Data
    - Insert existing hardcoded testimonials as initial data
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published testimonials"
  ON testimonials
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view all testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO testimonials (quote, author, location, display_order, published) VALUES
  ('I''ve never felt comfortable in front of a camera, but the entire session was so relaxed and easy. The photos captured exactly what we were hoping for—natural, warm and full of personality. Easily the best photography experience we''ve had.', 'Client Review', 'Kelowna, BC', 0, true),
  ('We booked a family session while visiting Kelowna and couldn''t be happier. The kids had fun, the photos look incredible, and the whole process felt effortless. These are images we''ll cherish for years.', 'Family Session', 'Kelowna, BC', 1, true),
  ('Not only did the photos exceed our expectations, but the communication, planning and direction during the session were exceptional. We felt completely taken care of.', 'Client Review', 'Kelowna, BC', 2, true);
