import { MapPin, Phone, Mail, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getPageSEO, type PageSEOSettings } from '../lib/seo';

export default function Contact() {
  const [seoSettings, setSeoSettings] = useState<PageSEOSettings | null>(null);

  useEffect(() => {
    getPageSEO('contact').then(setSeoSettings);
  }, []);

  const pageTitle = seoSettings?.seo_title || 'Contact Us - Get In Touch';
  const pageDescription = seoSettings?.meta_description || 'Ready to book your photography session? Contact us today to discuss your needs.';

  return (
    <div className="min-h-screen bg-[#f8f6f3] pt-24">
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
      <div className="relative h-[300px] bg-gradient-to-br from-[#d4c5b0] via-[#c9b89a] to-[#b8a585]">
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-3xl tracking-[0.3em] uppercase text-neutral-800 mb-6 font-bold">Contact</h1>
            <p className="text-neutral-700 max-w-xl text-lg">
              Let's discuss your wedding day
            </p>
          </div>
        </div>
      </div>

      <section className="py-32 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              <h2 className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-6">Inquire</h2>
              <h3 className="text-5xl mb-12 text-neutral-800" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>Get in Touch</h3>

              <iframe
                src="https://deepskyblue-cormorant-766129.hostingersite.com/"
                className="w-full border-0"
                style={{ minHeight: '800px' }}
                title="Contact Form"
              />
            </div>

            <div className="lg:col-span-2 space-y-12">
              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-neutral-800 mb-1">Location</p>
                      <p className="text-sm text-neutral-600">Kelowna, BC</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-neutral-800 mb-1">Phone</p>
                      <p className="text-sm text-neutral-600">(778) 237-5140</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-neutral-800 mb-1">Email</p>
                      <p className="text-sm text-neutral-600">syncingfilms@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-6">Follow us on Instagram</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/syncingfilms/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 border border-neutral-300 hover:border-maroon flex items-center justify-center transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-neutral-600" />
                  </a>
                </div>
              </div>

              <div className="bg-white p-8 border border-neutral-200">
                <h4 className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4">Response Time</h4>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  We typically respond to inquiries within 24 hours during business days.
                  Looking forward to hearing about your special day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
