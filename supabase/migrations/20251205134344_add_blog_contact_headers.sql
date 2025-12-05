/*
  # Add Blog and Contact Page Header Images

  1. Changes
    - Add 'blog_header' and 'contact_header' image keys to about_page_images table
    - This allows managing Blog and Contact page headers through admin panel

  2. Notes
    - Centralizing all page header images in one table for easy management
    - Default images are set but can be updated through admin interface
*/

INSERT INTO about_page_images (image_key, image_url, alt_text, display_order) VALUES
  ('blog_header', '/assets/images/hero-1.jpg', 'Journal and wedding stories', 1),
  ('contact_header', '/assets/images/contact-hero.jpg', 'Contact us', 2)
ON CONFLICT (image_key) DO NOTHING;
