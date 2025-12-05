# Image Management Guide

This guide explains how images are managed in the application using Supabase Storage.

## Overview

All images in the application are stored in Supabase Storage and referenced in the database. This ensures:
- Images are properly deployed to production
- Fast loading times with CDN delivery
- Secure access control
- Easy management through the admin panel

## Storage Buckets

The application uses three storage buckets:

### 1. `images`
- **Purpose**: Homepage images, about page images, and general page images
- **Public Access**: Yes
- **Path Structure**:
  - `homepage/homepage_{position}_{timestamp}.{ext}` - Homepage hero images
  - `pages/page-{key}-{timestamp}.{ext}` - About, Stories, Blog, Contact header images

### 2. `project-thumbnails`
- **Purpose**: Project portfolio thumbnails
- **Public Access**: Yes
- **Path Structure**: `project-thumbnails/{timestamp}-{random}.{ext}`

### 3. `blog-images`
- **Purpose**: Blog post featured images
- **Public Access**: Yes
- **Path Structure**: `blog-images/{timestamp}-{random}.{ext}`

## Database Tables

### `homepage_images`
Stores the 9 hero section images on the homepage.
- `position` (0-8): Position in the grid layout
- `image_url`: Full Supabase Storage URL
- `alt_text`: Accessibility text

### `about_page_images`
Stores images for About, Stories, Blog, and Contact pages.
- `image_key`: Unique identifier (e.g., 'hero', 'story_main', 'blog_header')
- `image_url`: Full Supabase Storage URL
- `alt_text`: Accessibility text
- `display_order`: Ordering for gallery images

### `projects`
Stores portfolio projects with thumbnails.
- `cover_image_url`: Main project cover
- `thumbnail_url`: Gallery thumbnail
- Other project metadata

### `blog_posts`
Stores blog posts with featured images.
- `image`: Featured image URL
- `og_image`: Social media preview image
- Other post content

## Admin Panel Usage

### Homepage Images
1. Navigate to `/admin/dashboard` and select "Homepage Images"
2. Upload images for each of the 9 positions
3. Images are automatically compressed and uploaded to Supabase Storage
4. Database is updated with the new URL
5. Changes appear immediately on the live site

### Page Header Images
1. Navigate to `/admin/dashboard` and select "About & Page Images"
2. Upload header images for About, Stories, Blog, and Contact pages
3. Update alt text for accessibility
4. Changes take effect immediately

### Projects
1. Navigate to `/admin/dashboard` and select "Manage Projects"
2. Create or edit a project
3. Upload thumbnail images
4. Images are stored in the `project-thumbnails` bucket

### Blog Posts
1. Navigate to `/admin/dashboard` and select "Manage Blog Posts"
2. Create or edit a blog post
3. Upload featured images
4. Images are stored in the `blog-images` bucket

## Utility Functions

The `src/lib/storage.ts` file provides helper functions:

```typescript
// Get public URL for a storage object
getStorageUrl(bucket, path)

// Upload an image
uploadImage({ bucket, file, path, upsert })

// Delete an image
deleteImage(bucket, path)

// Update an image (delete old, upload new)
updateImage(bucket, currentUrl, newFile, path)

// Extract path from Supabase URL
extractPathFromUrl(url, bucket)

// Normalize URLs with cache-busting
normalizeImageUrl(url, cacheBust)
```

## Image Optimization

Images are automatically compressed using the `compressImage` utility:
- Maintains quality while reducing file size
- Converts to WebP format when beneficial
- Maximum dimension: 2400px
- Quality: 0.85

## Fallback Behavior

Components are designed to gracefully handle missing images:
- Homepage hero: Falls back to placeholder
- Page headers: Falls back to default header image
- Projects: Shows "No image" placeholder
- Blog posts: Shows default blog image

## Security

All storage buckets have Row Level Security (RLS) policies:
- **Public**: Can read (view) all images
- **Authenticated**: Can upload, update, and delete images
- Only authenticated admin users can manage images through the admin panel

## Migration from Local Assets

If you have local images in `/assets/images/`, upload them through the admin panel:

1. Log into the admin panel
2. Navigate to the appropriate section (Homepage, Page Images, etc.)
3. Upload the images using the file input
4. The system will handle storage and database updates automatically

## Troubleshooting

### Images not loading
- Check browser console for errors
- Verify image URLs in database point to Supabase Storage
- Ensure storage bucket policies allow public read access

### Upload fails
- Verify you're logged in as an authenticated user
- Check file size (10MB limit)
- Ensure file is a valid image format (JPG, PNG, WebP, GIF)
- Check browser console for detailed error messages

### Images not updating
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Wait a few seconds for CDN cache to refresh
- Verify the database record was updated with the new URL

## Best Practices

1. **Use high-quality images**: Start with the best quality, the system will optimize
2. **Descriptive alt text**: Always add meaningful alt text for accessibility
3. **Consistent aspect ratios**:
   - Homepage hero: Portrait (3:4)
   - Page headers: Landscape (16:9)
   - Projects: Portrait (3:4)
4. **File naming**: Let the system handle naming automatically
5. **Regular backups**: Supabase handles backups, but download important images periodically
