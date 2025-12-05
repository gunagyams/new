import { supabase } from './supabase';

export interface PageSEOSettings {
  seo_title: string;
  meta_description: string;
  keywords: string;
  canonical_url: string;
  robots_meta: string;
  og_title: string;
  og_description: string;
  og_image: string;
  og_type: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
}

export async function getPageSEO(pageSlug: string): Promise<PageSEOSettings | null> {
  try {
    const { data, error } = await supabase
      .from('page_seo_settings')
      .select('*')
      .eq('page_slug', pageSlug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching page SEO:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching page SEO:', error);
    return null;
  }
}
