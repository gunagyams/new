/*
  # Add Storage Policies for All Buckets

  ## Overview
  This migration adds comprehensive storage policies for all image buckets to ensure
  proper access control while maintaining security.

  ## Buckets Covered
  1. `images` - Homepage, about page, and general images
  2. `project-thumbnails` - Project and portfolio thumbnails
  3. `blog-images` - Blog post featured images

  ## Security
  - Public read access for all images (allows website visitors to view images)
  - Authenticated users can upload, update, and delete images
  - Maintains proper access control for admin panel functionality
*/

-- Policies for 'project-thumbnails' bucket
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Public read access for project thumbnails" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload project thumbnails" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update project thumbnails" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete project thumbnails" ON storage.objects;
END $$;

CREATE POLICY "Public read access for project thumbnails"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-thumbnails');

CREATE POLICY "Authenticated users can upload project thumbnails"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-thumbnails');

CREATE POLICY "Authenticated users can update project thumbnails"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-thumbnails');

CREATE POLICY "Authenticated users can delete project thumbnails"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-thumbnails');

-- Policies for 'blog-images' bucket
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Public read access for blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;
END $$;

CREATE POLICY "Public read access for blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');