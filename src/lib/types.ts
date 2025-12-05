export interface Project {
  id: string;
  title: string;
  description: string;
  client_names?: string;
  event_date?: string;
  event_type?: string;
  location?: string;
  featured?: boolean;
  published?: boolean;
  gallery_url?: string;
  thumbnail_url?: string;
  access_code?: string;
  is_locked?: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  published?: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  seo_focus_keyword?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  canonical_url?: string;
  robots_meta?: string;
}
