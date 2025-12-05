/*
  # Add Stories Page Header Image Management

  1. Changes
    - Add 'stories_header' image key to about_page_images table
    - This will allow managing the Stories page header through admin panel

  2. Notes
    - Reusing the existing about_page_images table for all page images
    - This keeps image management centralized in one place
*/

INSERT INTO about_page_images (image_key, image_url, alt_text, display_order) VALUES
  ('stories_header', '/assets/images/hero-2.jpg', 'Wedding stories collection', 0)
ON CONFLICT (image_key) DO NOTHING;
