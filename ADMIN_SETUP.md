# Admin Panel Setup Guide

## Overview

Your photography website now has a complete admin panel for managing projects and blog posts. The system uses Supabase for authentication and data storage, with external gallery links to minimize storage costs.

## Features

### Projects Management
- Add/edit/delete projects
- Upload thumbnail images (auto-compressed to 200-300KB)
- Link to external galleries (Google Photos, Dropbox, etc.)
- Password-protect galleries with access codes
- Publish/unpublish projects
- Mark projects as featured

### Blog Management
- WordPress-style rich text editor (Tiptap)
- Create/edit/delete blog posts
- Upload featured images
- Automatic slug generation
- Category management
- Publish/unpublish posts
- SEO-friendly URLs

### Page Images
- Manage images across multiple pages (About, Stories, etc.)
- Upload hero banners, story images, and gallery photos
- Update alt text for accessibility
- No code editing required
- Images stored in Supabase with automatic URL management

## Getting Started

### Step 1: Create Admin User

You need to create an admin user account in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Enter your email and password
5. Click "Create User"

### Step 2: Access Admin Panel

1. Visit `/login` on your website
2. Sign in with the credentials you created
3. You'll be redirected to `/admin`

## Admin Routes

- `/login` - Admin login page
- `/admin` - Dashboard with statistics
- `/admin/projects` - List all projects
- `/admin/projects/new` - Create new project
- `/admin/projects/:id` - Edit existing project
- `/admin/blog` - List all blog posts
- `/admin/blog/new` - Create new blog post
- `/admin/blog/:id` - Edit existing blog post
- `/admin/about-images` - Manage About page images
- `/admin/seo` - Manage page SEO settings

## Using External Galleries

### Supported Services

The system works with any public gallery link:
- Google Photos (shared albums)
- Dropbox (public folders)
- iCloud Photos (shared albums)
- Any other image hosting service with public URLs

### How to Set Up

1. Upload your full-resolution photos to your preferred service
2. Create a public/shared link
3. In the admin panel, paste this link in the "External Gallery URL" field
4. Upload a single thumbnail image for the project listing
5. Optionally, set an access code to password-protect the gallery

## Storage Usage

With this approach:
- Only thumbnails (~200-300KB each) are stored in Supabase
- Blog featured images (~500KB-1MB each) are stored in Supabase
- Full-resolution client photos are NOT stored (they're on external services)
- 1GB Supabase storage can hold 1,000+ project thumbnails

## Access Codes

When a gallery is locked:
1. Users see a lock icon on the project thumbnail
2. Clicking opens a modal asking for an access code
3. Valid access code redirects to the external gallery
4. Invalid code shows an error message

You can:
- Manually set access codes
- Use the "Generate" button to create random codes
- Share codes via email with your clients

## Managing Page Images

You can customize images across your website with 10 image slots:

### About Page (7 images)
1. **Hero Image** - Large banner at the top of the page
2. **Story Main Image** - Large image next to the story text
3. **Gallery Images 1-4** - Four images displayed in a grid layout
4. **Wedding Banner** - Full-width cinematic section

### Stories Page (1 image)
1. **Stories Header** - Header banner for the Client Area/Stories page

### Blog Page (1 image)
1. **Blog Header** - Header banner for the Journal/Blog page

### Contact Page (1 image)
1. **Contact Header** - Header banner for the Contact page

### How to Change Images

1. Go to `/admin/about-images` in your admin panel
2. Each image slot shows which page it belongs to
3. For each image slot, you can:
   - **Upload a new image** using the file picker
   - **Update the alt text** for accessibility and SEO
   - See a preview of the current image
4. Click "Save" after updating alt text
5. Images are automatically uploaded to Supabase storage
6. Pages update instantly with your new images

### Image Recommendations

- **Header/Hero sections**: Use landscape images (1920x1080px or larger)
- **Gallery images**: High quality portraits (1200x1600px minimum)
- **Format**: JPG for photographs to keep file sizes reasonable
- **Alt text**: Always add descriptive alt text for accessibility

## Rich Text Editor

The blog editor supports:
- Text formatting (bold, italic, strikethrough)
- Headings (H2, H3, H4)
- Lists (bullet and numbered)
- Links
- Images (via URL)
- Blockquotes
- Code blocks
- Undo/Redo

## Tips

1. **Thumbnail Images**: Keep them small but high quality. The system auto-compresses them.
2. **Gallery Links**: Test your external links before publishing to ensure they're accessible.
3. **Access Codes**: Use memorable codes for clients (e.g., "SARAH2024" instead of random strings).
4. **Blog Slugs**: These create the URL for your posts (/blog/your-slug), so make them descriptive.
5. **Featured Projects**: Use the "featured" toggle to highlight projects on your homepage.

## Security

- Admin panel requires authentication (Supabase Auth)
- All admin routes are protected
- Storage buckets have proper RLS policies
- Access codes are case-insensitive for user convenience

## Need Help?

If you encounter any issues:
1. Check that your Supabase environment variables are set correctly in `.env`
2. Ensure your admin user has been created in Supabase
3. Verify storage buckets are created (they're created automatically on first migration)
4. Test external gallery links in a private/incognito browser window
