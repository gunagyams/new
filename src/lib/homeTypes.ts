import { LucideIcon } from 'lucide-react';

export interface ImageItem {
  id: string;
  url: string;
  alt: string;
  heightClass?: string; // Tailwind height class for masonry variety
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  location: string;
}

export interface NavLink {
  label: string;
  href: string;
}