/*
  # Setup Storage Policies for Image Buckets

  ## Storage Buckets
  - `project-thumbnails` - Public bucket for project thumbnail images
  - `blog-images` - Public bucket for blog featured images

  ## Security Policies
  1. Public read access for all users
  2. Authenticated users (admins) can upload images
  3. Authenticated users can delete their uploaded images
*/

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