import { MapPin, Phone, Mail, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Helmet } from 'react-helmet-async';
import { getPageSEO, type PageSEOSettings } from '../lib/seo';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    location: '',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seoSettings, setSeoSettings] = useState<PageSEOSettings | null>(null);

  useEffect(() => {
    getPageSEO('contact').then(setSeoSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            event_date: formData.eventDate,
            location: formData.location,
            details: formData.details,
          },
        ]);

      if (error) throw error;

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        location: '',
        details: '',
      });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
            <h1 className="text-xs tracking-[0.3em] uppercase text-neutral-800 mb-3">Contact</h1>
            <p className="text-neutral-700 max-w-xl text-sm">
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

              {submitted && (
                <div className="mb-8 bg-white border border-neutral-200 p-6">
                  <p className="text-neutral-800">
                    Thank you for your inquiry. We'll be in touch within 24 hours.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 border border-neutral-300 text-sm focus:border-maroon focus:outline-none bg-white"
                      placeholder="YOUR NAME *"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 border border-neutral-300 text-sm focus:border-maroon focus:outline-none bg-white"
                      placeholder="EMAIL ADDRESS *"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-6 py-4 border border-neutral-300 text-sm focus:border-maroon focus:outline-none bg-white"
                      placeholder="PHONE NUMBER"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="w-full px-6 py-4 border border-neutral-300 text-sm focus:border-maroon focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-6 py-4 border border-neutral-300 text-sm focus:border-neutral-800 focus:outline-none bg-white"
                    placeholder="EVENT LOCATION"
                  />
                </div>

                <div>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    required
                    rows={8}
                    className="w-full px-6 py-4 border border-neutral-300 text-sm focus:border-neutral-800 focus:outline-none resize-none bg-white"
                    placeholder="TELL US ABOUT YOUR WEDDING *"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-maroon hover:bg-maroon-dark text-white px-12 py-4 text-xs tracking-[0.2em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-12">
              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-neutral-800 mb-1">Location</p>
                      <p className="text-sm text-neutral-600">Vancouver, BC</p>
                      <p className="text-xs text-neutral-500">Serving all of Canada</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-neutral-800 mb-1">Phone</p>
                      <p className="text-sm text-neutral-600">(604) 555-0123</p>
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
                <h3 className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-6">Follow</h3>
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
