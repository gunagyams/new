import { Camera, Film, Heart } from 'lucide-react';
import { ImageItem, ServiceItem, TestimonialItem, NavLink } from './types';

// Using Picsum with specific IDs that resemble wedding/portrait photography
// grayscale param added where needed in component logic, or we use specific toned images.
export const HERO_IMAGES_COL_1: ImageItem[] = [
  { id: '1', url: 'https://picsum.photos/id/1059/600/800', alt: 'Bride styling', heightClass: 'h-[400px]' },
  { id: '2', url: 'https://picsum.photos/id/1060/600/900', alt: 'Couple embrace', heightClass: 'h-[500px]' },
  { id: '3', url: 'https://picsum.photos/id/1027/600/700', alt: 'Walking away', heightClass: 'h-[350px]' },
];

export const HERO_IMAGES_COL_2: ImageItem[] = [
  { id: '4', url: 'https://picsum.photos/id/338/600/1000', alt: 'Details', heightClass: 'h-[600px]' },
  { id: '5', url: 'https://picsum.photos/id/331/600/800', alt: 'Vows', heightClass: 'h-[450px]' },
  { id: '6', url: 'https://picsum.photos/id/349/600/900', alt: 'Celebration', heightClass: 'h-[500px]' },
];

export const HERO_IMAGES_COL_3: ImageItem[] = [
  { id: '7', url: 'https://picsum.photos/id/342/600/800', alt: 'Portrait', heightClass: 'h-[400px]' },
  { id: '8', url: 'https://picsum.photos/id/325/600/700', alt: 'Forest setting', heightClass: 'h-[350px]' },
  { id: '9', url: 'https://picsum.photos/id/433/600/900', alt: 'Candid moment', heightClass: 'h-[550px]' },
];

export const GALLERY_IMAGES: ImageItem[] = [
  { id: 'g1', url: 'https://picsum.photos/id/129/800/600', alt: 'Venue details' },
  { id: 'g2', url: 'https://picsum.photos/id/447/600/900', alt: 'Black and white portrait' },
  { id: 'g3', url: 'https://picsum.photos/id/452/800/800', alt: 'Table setting' },
  { id: 'g4', url: 'https://picsum.photos/id/453/600/800', alt: 'Musician' },
  { id: 'g5', url: 'https://picsum.photos/id/514/800/600', alt: 'Car' },
  { id: 'g6', url: 'https://picsum.photos/id/551/600/700', alt: 'Hands' },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 's1',
    title: 'Editorial Photography',
    description: 'Timeless imagery captured on both digital and medium format film, focusing on the quiet, unscripted moments.',
    icon: Camera,
  },
  {
    id: 's2',
    title: 'Super 8 & Cinema',
    description: 'Nostalgic motion pictures that capture the atmosphere and emotion of your celebration in a way stills cannot.',
    icon: Film,
  },
  {
    id: 's3',
    title: 'Curated Heirlooms',
    description: 'Bespoke fine art albums and museum-grade prints designed to preserve your legacy for generations.',
    icon: Heart,
  },
];

export const TESTIMONIAL: TestimonialItem = {
  id: 't1',
  quote: "They didn't just capture how it looked, but how it felt. Every image is a piece of art that we will cherish forever.",
  author: "Eleanor & Julian",
  location: "Lake Como, Italy"
};

export const NAV_LINKS: NavLink[] = [
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Portfolio', href: '#gallery' },
  { label: 'Services', href: '#services' },
  { label: 'Journal', href: '#journal' },
  { label: 'Contact', href: '#contact' },
];