import { Camera, Film, Heart } from 'lucide-react';
import { ImageItem, ServiceItem, TestimonialItem, NavLink } from './homeTypes';

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
    title: 'Cinematic Storytelling',
    description: 'Real moments, captured with intention and emotion.',
    icon: Camera,
  },
  {
    id: 's2',
    title: 'Cultural Wedding Expertise',
    description: 'Deep understanding of Indian & South Asian traditions.',
    icon: Film,
  },
  {
    id: 's3',
    title: 'Timeless Legacy',
    description: 'Memories designed to live far beyond the wedding day.',
    icon: Heart,
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    quote: "I've never felt comfortable in front of a camera, but the entire session was so relaxed and easy. The photos captured exactly what we were hoping for—natural, warm and full of personality. Easily the best photography experience we've had.",
    author: "Client Review",
    location: "Kelowna, BC"
  },
  {
    id: 't2',
    quote: "We booked a family session while visiting Kelowna and couldn't be happier. The kids had fun, the photos look incredible, and the whole process felt effortless. These are images we'll cherish for years.",
    author: "Family Session",
    location: "Kelowna, BC"
  },
  {
    id: 't3',
    quote: "Not only did the photos exceed our expectations, but the communication, planning and direction during the session were exceptional. We felt completely taken care of.",
    author: "Client Review",
    location: "Kelowna, BC"
  }
];

export const TESTIMONIAL: TestimonialItem = TESTIMONIALS[0];

export const NAV_LINKS: NavLink[] = [
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Portfolio', href: '#gallery' },
  { label: 'Services', href: '#services' },
  { label: 'Journal', href: '#journal' },
  { label: 'Contact', href: '#contact' },
];