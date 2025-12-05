import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Camera, Heart, Mountain, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getPageSEO, type PageSEOSettings } from '../lib/seo';

const principles = [
  {
    icon: Camera,
    number: '01.',
    title: 'Camera in hand, always.',
    description: 'I have been capturing candids of friends and family for years. Even back then, I was drawn to unposed moments, the kind that stick with you.'
  },
  {
    icon: Heart,
    number: '02.',
    title: 'A quiet kind of passion.',
    description: "Photography isn't my day job, but it's where I feel most present. And that presence is what I bring to every session."
  },
  {
    icon: Mountain,
    number: '03.',
    title: 'Raised on simplicity.',
    description: 'Good food, deep conversations, mountain views, my style (and life) leans toward the genuine, the minimal, the meaningful.'
  },
  {
    icon: Globe,
    number: '04.',
    title: 'From 1 culture to multiple.',
    description: 'I grew up surrounded by vibrant culture. Now I bring that sense of soul and story into every photoshoot I do.'
  }
];

interface AboutImage {
  image_key: string;
  image_url: string;
  alt_text: string;
}

export default function About() {
  const [seoSettings, setSeoSettings] = useState<PageSEOSettings | null>(null);
  const [images, setImages] = useState<Record<string, AboutImage>>({});

  useEffect(() => {
    getPageSEO('about').then(setSeoSettings);
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('about_page_images')
        .select('*');

      if (error) throw error;

      const imageMap: Record<string, AboutImage> = {};
      data?.forEach((img) => {
        imageMap[img.image_key] = img;
      });
      setImages(imageMap);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const getImageUrl = (key: string, fallback: string) => {
    const url = images[key]?.image_url || fallback;
    if (url && url.includes('supabase')) {
      return `${url}?t=${Date.now()}`;
    }
    return url;
  };

  const getImageAlt = (key: string, fallback: string) => {
    return images[key]?.alt_text || fallback;
  };

  const pageTitle = seoSettings?.seo_title || 'About Hardeep Singh - SynCing Films';
  const pageDescription = seoSettings?.meta_description || 'Full-time engineer and part-time memory-keeper capturing moments that turn into lifelong memories.';

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {seoSettings?.keywords && <meta name="keywords" content={seoSettings.keywords} />}
        {seoSettings?.canonical_url && <link rel="canonical" href={seoSettings.canonical_url} />}
        {seoSettings?.robots_meta && <meta name="robots" content={seoSettings.robots_meta} />}

        <meta property="og:title" content={seoSettings?.og_title || pageTitle} />
        <meta property="og:description" content={seoSettings?.og_description || pageDescription} />
        {seoSettings?.og_image && <meta property="og:image" content={seoSettings.og_image} />}
        <meta property="og:type" content={seoSettings?.og_type || 'website'} />

        <meta name="twitter:card" content={seoSettings?.twitter_card || 'summary_large_image'} />
        <meta name="twitter:title" content={seoSettings?.twitter_title || pageTitle} />
        <meta name="twitter:description" content={seoSettings?.twitter_description || pageDescription} />
        {seoSettings?.twitter_image && <meta name="twitter:image" content={seoSettings.twitter_image} />}
      </Helmet>

      <section className="relative py-32 px-8 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-light/10 via-white to-stone-50"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-maroon-light/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-stone-100/40 rounded-full blur-3xl"></div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-neutral-300"></div>
              <span className="text-xs tracking-[0.3em] uppercase text-neutral-500">My Story</span>
              <div className="w-12 h-px bg-neutral-300"></div>
            </div>
            <h2 className="text-5xl lg:text-6xl xl:text-7xl text-neutral-900 mb-10 leading-[1.15] max-w-5xl mx-auto tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
              Hi, I am Hardeep, a full-time engineer and part-time memory-keeper behind Syncing Films.
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 lg:order-1">
              <div className="bg-white/80 backdrop-blur-sm border border-neutral-200 p-12 shadow-xl">
                <p className="text-xl text-neutral-700 leading-relaxed mb-6">
                  I pick up my camera to capture the quiet, unposed moments that turn into lifelong memories. Born and raised in India and now rooted in Canada, I have spent over a decade quietly documenting the moments that matter, drawn to the stillness of nature and the power of storytelling through photographs.
                </p>
                <p className="text-xl text-neutral-700 leading-relaxed mb-6">
                  Everything changed when I got married – realizing the moments I wished were captured, I knew I wanted to be that someone for others.
                </p>
                <div className="pt-6 border-t border-neutral-200">
                  <p className="text-sm tracking-[0.25em] uppercase text-neutral-600 font-semibold">
                    AT SYNCING FILMS, I FOCUS ON HONEST, TIMELESS PORTRAITS
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-maroon-light/50 to-stone-200 opacity-50 blur-2xl group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative overflow-hidden">
                  <img
                    src={getImageUrl('story_main', '/assets/images/DSC03847.jpg')}
                    alt={getImageAlt('story_main', 'Photography lifestyle')}
                    className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-8 lg:px-16 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/images/gallery/gallery-2.jpg"
            alt="Photography background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/80"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-12">
            <div className="inline-block w-16 h-0.5 bg-maroon mb-8"></div>
          </div>
          <p className="text-2xl lg:text-3xl text-neutral-300 leading-relaxed max-w-4xl mx-auto mb-16" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
            Capturing emotions with intention. Pictures that feel real, because the moments are.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
            <div className="text-center border border-white/20 p-8 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors">
              <div className="text-5xl font-light text-maroon mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>10+</div>
              <p className="text-white/90 text-sm tracking-[0.2em] uppercase">Years Experience</p>
            </div>
            <div className="text-center border border-white/20 p-8 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors">
              <div className="text-5xl font-light text-maroon mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>200+</div>
              <p className="text-white/90 text-sm tracking-[0.2em] uppercase">Sessions Captured</p>
            </div>
            <div className="text-center border border-white/20 p-8 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors">
              <div className="text-5xl font-light text-maroon mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>∞</div>
              <p className="text-white/90 text-sm tracking-[0.2em] uppercase">Memories Created</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-8 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-maroon-light/10 to-white"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative overflow-hidden shadow-xl group">
                    <img
                      src={getImageUrl('gallery_1', '/assets/images/gallery/gallery-1.jpg')}
                      alt={getImageAlt('gallery_1', 'Wedding moment')}
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="relative overflow-hidden shadow-xl group">
                    <img
                      src={getImageUrl('gallery_3', '/assets/images/gallery/gallery-3.jpg')}
                      alt={getImageAlt('gallery_3', 'Couple portrait')}
                      className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="relative overflow-hidden shadow-xl group">
                    <img
                      src={getImageUrl('gallery_2', '/assets/images/gallery/gallery-2.jpg')}
                      alt={getImageAlt('gallery_2', 'Candid moment')}
                      className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="relative overflow-hidden shadow-xl group">
                    <img
                      src={getImageUrl('gallery_4', '/assets/images/gallery/gallery-4.jpg')}
                      alt={getImageAlt('gallery_4', 'Emotional moment')}
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-12">
                <div className="inline-flex items-center gap-4 mb-8">
                  <div className="w-12 h-px bg-neutral-300"></div>
                  <span className="text-xs tracking-[0.3em] uppercase text-neutral-500">The Turning Point</span>
                  <div className="w-12 h-px bg-neutral-300"></div>
                </div>
              </div>
              <h2 className="text-5xl lg:text-6xl text-neutral-900 mb-12 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                But everything changed when I got married.
              </h2>
              <div className="mb-12">
                <div className="relative pl-8 border-l-2 border-maroon">
                  <p className="text-xl lg:text-2xl text-neutral-700 leading-relaxed italic mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    There were moments I wish someone had caught — the quiet joy, the in-betweens...
                  </p>
                  <p className="text-xl text-neutral-700 leading-relaxed">
                    That gap made me realize: I want to be that someone for others.
                  </p>
                </div>
              </div>
              <p className="text-lg text-neutral-600 leading-relaxed mb-10">
                So I started <span className="font-semibold text-neutral-900">Syncing Films</span>, to offer others what I missed — honest, timeless portraits you will hang proudly, and feel those emotions your whole life. My style is simple, genuine, and soulful, influenced by vibrant cultures, meaningful moments, and the beauty of life's little details.
              </p>
              <Link
                to="/stories"
                className="group inline-flex items-center gap-3 border-2 border-maroon text-maroon px-12 py-5 text-xs tracking-[0.25em] uppercase hover:bg-maroon hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                VIEW PORTFOLIO
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-8 lg:px-16 bg-neutral-50">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-24">
            <div className="inline-block w-20 h-0.5 bg-maroon mb-8"></div>
            <h2 className="text-4xl lg:text-5xl text-neutral-900 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
              My Philosophy
            </h2>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
              Four principles that guide every frame I capture
            </p>
          </div>
          <div className="grid lg:grid-cols-4 gap-8">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div
                  key={index}
                  className="group bg-white p-10 shadow-sm hover:shadow-2xl transition-all duration-500 border border-neutral-200 hover:border-maroon-light/50 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-maroon to-maroon-light transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className="mb-6">
                      <Icon className="w-10 h-10 text-maroon/60 group-hover:text-maroon transition-colors" strokeWidth={1.5} />
                    </div>
                    <div className="text-5xl text-maroon-light/30 group-hover:text-maroon-light/50 transition-colors mb-4 font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {principle.number}
                    </div>
                    <h3 className="text-2xl lg:text-3xl text-neutral-900 leading-tight mb-6 group-hover:text-neutral-800 transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>
                      {principle.title}
                    </h3>
                    <div className="w-12 h-px bg-neutral-300 mb-6"></div>
                    <p className="text-neutral-600 leading-relaxed text-base group-hover:text-neutral-700 transition-colors">
                      {principle.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getImageUrl('wedding_banner', '/assets/images/DSC04213.jpg')}
            alt={getImageAlt('wedding_banner', 'Beautiful wedding moment')}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>
        <div className="relative z-10 h-full flex items-center px-8 lg:px-16">
          <div className="max-w-2xl text-white">
            <div className="inline-block w-16 h-0.5 bg-maroon mb-8"></div>
            <h2 className="text-5xl lg:text-6xl mb-8 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Every wedding tells<br />a unique story
            </h2>
            <p className="text-xl text-white/90 leading-relaxed mb-10">
              From intimate ceremonies to grand celebrations, I document the authentic emotions that make your day unforgettable.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 border-2 border-white text-white px-12 py-5 text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-neutral-900 transition-all duration-300"
            >
              Start Your Story
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 px-8 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block w-20 h-0.5 bg-maroon mb-8"></div>
            <h2 className="text-4xl lg:text-5xl text-neutral-900 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
              What Drives Me
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="border-l-4 border-maroon pl-8 py-4">
                <h3 className="text-2xl text-neutral-900 mb-4 font-semibold">Authentic Moments</h3>
                <p className="text-neutral-600 leading-relaxed">
                  I believe the best photos happen when you forget the camera is there. My approach is unobtrusive, allowing genuine emotions to unfold naturally.
                </p>
              </div>
              <div className="border-l-4 border-maroon pl-8 py-4">
                <h3 className="text-2xl text-neutral-900 mb-4 font-semibold">Timeless Artistry</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Trends fade, but emotion endures. I focus on creating images that will feel just as powerful decades from now as they do today.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="border-l-4 border-maroon pl-8 py-4">
                <h3 className="text-2xl text-neutral-900 mb-4 font-semibold">Cultural Respect</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Having experienced multiple cultures firsthand, I bring sensitivity and understanding to every tradition and ceremony I document.
                </p>
              </div>
              <div className="border-l-4 border-maroon pl-8 py-4">
                <h3 className="text-2xl text-neutral-900 mb-4 font-semibold">Personal Connection</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Before I'm your photographer, I want to be someone you trust. Getting to know you helps me capture your story authentically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-40 px-8 lg:px-16 bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-maroon rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-maroon rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-12">
            <div className="inline-block w-16 h-0.5 bg-maroon mb-8"></div>
          </div>
          <h2 className="text-5xl lg:text-6xl mb-8 leading-tight tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
            Let's Create Something Beautiful Together
          </h2>
          <p className="text-xl mb-14 text-neutral-300 leading-relaxed max-w-2xl mx-auto">
            I'd love to hear about your story and how we can capture your most meaningful moments
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 border-2 border-white text-white px-14 py-5 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-neutral-900 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            Get in Touch
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
