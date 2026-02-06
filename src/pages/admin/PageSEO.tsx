import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, ChevronDown, ChevronUp } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import SEOPreview from '../../components/SEOPreview';

interface PageSEO {
  id: string;
  page_slug: string;
  page_name: string;
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

export default function PageSEO() {
  const [pages, setPages] = useState<PageSEO[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageSEO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    openGraph: false,
    twitter: false,
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('page_seo_settings')
        .select('*')
        .order('page_name');

      if (error) throw error;
      setPages(data || []);
      if (data && data.length > 0) {
        setSelectedPage(data[0]);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPage) return;

    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('page_seo_settings')
        .update({
          seo_title: selectedPage.seo_title,
          meta_description: selectedPage.meta_description,
          keywords: selectedPage.keywords,
          canonical_url: selectedPage.canonical_url,
          robots_meta: selectedPage.robots_meta,
          og_title: selectedPage.og_title,
          og_description: selectedPage.og_description,
          og_image: selectedPage.og_image,
          og_type: selectedPage.og_type,
          twitter_card: selectedPage.twitter_card,
          twitter_title: selectedPage.twitter_title,
          twitter_description: selectedPage.twitter_description,
          twitter_image: selectedPage.twitter_image,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedPage.id);

      if (error) throw error;

      setMessage('SEO settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
      fetchPages();
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      setMessage('Error saving SEO settings');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof PageSEO, value: string) => {
    if (!selectedPage) return;
    setSelectedPage({ ...selectedPage, [field]: value });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-neutral-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Page SEO Settings</h1>
        <p className="text-neutral-600">
          Manage SEO settings for all pages on your website
        </p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page Selection Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
            <h2 className="text-sm font-semibold text-neutral-800 mb-3 uppercase tracking-wide">
              Select Page
            </h2>
            <div className="space-y-2">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedPage?.id === page.id
                      ? 'bg-maroon text-white'
                      : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {page.page_name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SEO Settings Form */}
        <div className="lg:col-span-3 space-y-6">
          {selectedPage && (
            <>
              {/* Google Search Preview */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-neutral-800 mb-4">
                  Google Search Preview
                </h3>
                <SEOPreview
                  title={selectedPage.seo_title}
                  description={selectedPage.meta_description}
                  url={selectedPage.canonical_url || `https://yoursite.com/${selectedPage.page_slug}`}
                />
              </div>

              {/* Basic SEO Settings */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('basic')}
                  className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors"
                >
                  <h3 className="text-lg font-medium text-neutral-800">Basic SEO Settings</h3>
                  {expandedSections.basic ? (
                    <ChevronUp className="w-5 h-5 text-neutral-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-600" />
                  )}
                </button>

                {expandedSections.basic && (
                  <div className="border-t border-neutral-200 p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        SEO Title
                      </label>
                      <input
                        type="text"
                        value={selectedPage.seo_title || ''}
                        onChange={(e) => updateField('seo_title', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                        placeholder="Enter SEO title (50-60 characters recommended)"
                        maxLength={60}
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        {selectedPage.seo_title?.length || 0}/60 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Meta Description
                      </label>
                      <textarea
                        value={selectedPage.meta_description || ''}
                        onChange={(e) => updateField('meta_description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                        placeholder="Enter meta description (150-160 characters recommended)"
                        maxLength={160}
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        {selectedPage.meta_description?.length || 0}/160 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Keywords
                      </label>
                      <input
                        type="text"
                        value={selectedPage.keywords || ''}
                        onChange={(e) => updateField('keywords', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                        placeholder="photography, portraits, wedding, professional (comma-separated)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Canonical URL
                      </label>
                      <input
                        type="text"
                        value={selectedPage.canonical_url || ''}
                        onChange={(e) => updateField('canonical_url', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                        placeholder="https://yoursite.com/page"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Robots Meta
                      </label>
                      <select
                        value={selectedPage.robots_meta || 'index, follow'}
                        onChange={(e) => updateField('robots_meta', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                      >
                        <option value="index, follow">Index, Follow</option>
                        <option value="noindex, follow">No Index, Follow</option>
                        <option value="index, nofollow">Index, No Follow</option>
                        <option value="noindex, nofollow">No Index, No Follow</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Open Graph Settings */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('openGraph')}
                  className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors"
                >
                  <div>
                    <h3 className="text-lg font-medium text-neutral-800">Open Graph (Facebook)</h3>
                    <p className="text-sm text-neutral-600 mt-1">
                      Control how your page appears when shared on Facebook
                    </p>
                  </div>
                  {expandedSections.openGraph ? (
                    <ChevronUp className="w-5 h-5 text-neutral-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-600" />
                  )}
                </button>

                {expandedSections.openGraph && (
                  <div className="border-t border-neutral-200 p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        OG Title
                      </label>
                      <input
                        type="text"
                        value={selectedPage.og_title || ''}
                        onChange={(e) => updateField('og_title', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                        placeholder="Defaults to SEO title if empty"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        OG Description
                      </label>
                      <textarea
                        value={selectedPage.og_description || ''}
                        onChange={(e) => updateField('og_description', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                        placeholder="Defaults to meta description if empty"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        OG Image URL
                      </label>
                      <input
                        type="text"
                        value={selectedPage.og_image || ''}
                        onChange={(e) => updateField('og_image', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                        placeholder="https://yoursite.com/images/og-image.jpg"
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        Recommended: 1200x630px
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        OG Type
                      </label>
                      <select
                        value={selectedPage.og_type || 'website'}
                        onChange={(e) => updateField('og_type', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                      >
                        <option value="website">Website</option>
                        <option value="article">Article</option>
                        <option value="profile">Profile</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Twitter Card Settings */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('twitter')}
                  className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors"
                >
                  <div>
                    <h3 className="text-lg font-medium text-neutral-800">Twitter Card</h3>
                    <p className="text-sm text-neutral-600 mt-1">
                      Control how your page appears when shared on Twitter/X
                    </p>
                  </div>
                  {expandedSections.twitter ? (
                    <ChevronUp className="w-5 h-5 text-neutral-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-600" />
                  )}
                </button>

                {expandedSections.twitter && (
                  <div className="border-t border-neutral-200 p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Card Type
                      </label>
                      <select
                        value={selectedPage.twitter_card || 'summary_large_image'}
                        onChange={(e) => updateField('twitter_card', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                      >
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary Large Image</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Twitter Title
                      </label>
                      <input
                        type="text"
                        value={selectedPage.twitter_title || ''}
                        onChange={(e) => updateField('twitter_title', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                        placeholder="Defaults to SEO title if empty"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Twitter Description
                      </label>
                      <textarea
                        value={selectedPage.twitter_description || ''}
                        onChange={(e) => updateField('twitter_description', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                        placeholder="Defaults to meta description if empty"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Twitter Image URL
                      </label>
                      <input
                        type="text"
                        value={selectedPage.twitter_image || ''}
                        onChange={(e) => updateField('twitter_image', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                        placeholder="https://yoursite.com/images/twitter-image.jpg"
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        Recommended: 1200x628px
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-maroon text-white rounded-lg hover:bg-maroon-dark transition-colors disabled:bg-neutral-400"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save SEO Settings'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}
