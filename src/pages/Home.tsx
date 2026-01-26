import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { getPageSEO, type PageSEOSettings } from '../lib/seo';
import Loader from '../components/home/loader';
import Hero from '../components/home/hero';
import Intro from '../components/home/intro';
import Gallery from '../components/home/gallery';
import Services from '../components/home/services';
import Testimonials from '../components/home/testimonials';
import Contact from '../components/home/contact';
import Footer from '../components/home/footer';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [seoSettings, setSeoSettings] = useState<PageSEOSettings | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getPageSEO('home').then(setSeoSettings);
  }, []);

  const pageTitle = seoSettings?.seo_title || 'Professional Photography Services';
  const pageDescription = seoSettings?.meta_description || 'Capturing life\'s precious moments with artistic excellence and professional expertise.';

  return (
    <div className="bg-cream min-h-screen text-charcoal selection:bg-maroon/30">
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

      <AnimatePresence>
        {loading && <Loader />}
      </AnimatePresence>

      {!loading && (
        <>
          <Hero />
          <Intro />
          <Gallery />
          <Services />
          <Testimonials />
          <Contact />
          <Footer />
        </>
      )}
    </div>
  );
}
