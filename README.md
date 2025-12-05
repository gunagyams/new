# SynCing Films - Professional Photography Portfolio

A modern, responsive photography portfolio website built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Dynamic Image Management**: All images stored in Supabase Storage with admin panel management
- **Portfolio Gallery**: Showcase wedding photography work with password-protected client galleries
- **Blog/Journal**: Share stories, tips, and wedding inspiration
- **Contact Forms**: Integrated contact submissions stored in Supabase
- **SEO Optimized**: Comprehensive SEO settings per page with Open Graph and Twitter Card support
- **Admin Panel**: Full-featured admin interface for content management
- **Authentication**: Secure admin access with Supabase Auth
- **Responsive Design**: Beautiful on all devices from mobile to desktop
- **Performance**: Optimized images with automatic compression and WebP support

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Supabase (Database, Storage, Authentication)
- **Icons**: Lucide React
- **Rich Text Editor**: TipTap
- **Routing**: React Router v7
- **SEO**: React Helmet Async

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations
The migrations in `supabase/migrations/` need to be applied to your Supabase database.

5. Start the development server
```bash
npm run dev
```

## Image Management

All images are stored in Supabase Storage across three buckets:
- `images` - Homepage and page header images
- `project-thumbnails` - Portfolio project images
- `blog-images` - Blog post featured images

See [IMAGE_MANAGEMENT.md](./IMAGE_MANAGEMENT.md) for detailed documentation.

### Uploading Images

1. Log into the admin panel at `/admin/login`
2. Navigate to the appropriate section:
   - **Homepage Images**: Manage 9 hero section images
   - **About & Page Images**: Manage page headers and about page gallery
   - **Manage Projects**: Upload portfolio project images
   - **Manage Blog Posts**: Upload blog featured images
3. Upload images using the file inputs
4. Images are automatically compressed and stored in Supabase Storage

## Admin Panel

Access the admin panel at `/admin/login` with your Supabase auth credentials.

### Available Admin Features

- **Dashboard**: Overview and quick navigation
- **Homepage Images**: Manage hero section images (9 positions)
- **About & Page Images**: Manage page headers for About, Stories, Blog, Contact
- **Manage Projects**: Create/edit portfolio projects with images
- **Manage Blog Posts**: Create/edit blog posts with rich text editor
- **Page SEO**: Configure SEO settings for each page
- **View Submissions**: Access contact form submissions

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── home/        # Homepage-specific components
│   └── admin/       # Admin panel components
├── pages/           # Page components
│   ├── admin/       # Admin panel pages
│   └── *.tsx        # Public pages
├── lib/             # Utilities and configurations
│   ├── supabase.ts  # Supabase client
│   ├── storage.ts   # Storage helper functions
│   ├── seo.ts       # SEO utilities
│   └── types.ts     # TypeScript types
└── contexts/        # React contexts
```

## Database Schema

The application uses the following main tables:
- `homepage_images` - Homepage hero section images
- `about_page_images` - Page header and about gallery images
- `projects` - Portfolio projects
- `project_images` - Project gallery images
- `blog_posts` - Blog/journal posts
- `contact_submissions` - Contact form submissions
- `page_seo_settings` - SEO configuration per page

All tables have Row Level Security (RLS) enabled.

## Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Environment Variables

Ensure the following environment variables are set in your production environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Deployment Platforms

This project can be deployed to:
- Netlify (recommended)
- Vercel
- Any static hosting platform

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Admin Setup

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for detailed admin panel setup instructions.

## License

All rights reserved.
