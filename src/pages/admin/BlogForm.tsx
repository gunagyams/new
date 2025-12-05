import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BlogPost } from '../../lib/types';
import { compressFeaturedImage } from '../../lib/imageCompression';
import AdminLayout from '../../components/AdminLayout';
import RichTextEditor from '../../components/RichTextEditor';
import SEOPreview from '../../components/SEOPreview';
import { Save, ArrowLeft, Upload, X, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = [
  'Wedding Tips',
  'Real Weddings',
  'Photography Tips',
  'Trends',
  'Behind the Scenes',
];

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [seoExpanded, setSeoExpanded] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    category: CATEGORIES[0],
    published: false,
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    seo_focus_keyword: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_title: '',
    twitter_description: '',
    canonical_url: '',
    robots_meta: 'index, follow',
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchPost();
    }
  }, [id, isEdit]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setFormData(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Failed to load post');
      navigate('/admin/blog');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: isEdit ? formData.slug : generateSlug(title),
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const compressed = await compressFeaturedImage(file);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, compressed);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!confirm('Are you sure you want to remove this image?')) return;

    try {
      if (formData.image) {
        const urlParts = formData.image.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `blog-images/${fileName}`;

        await supabase.storage
          .from('blog-images')
          .remove([filePath]);
      }

      setFormData({ ...formData, image: '' });
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        updated_at: new Date().toISOString(),
        published_at: formData.published ? (formData.published_at || new Date().toISOString()) : null,
      };

      if (isEdit && id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(data)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert([{
          ...data,
          created_at: new Date().toISOString(),
        }]);

        if (error) throw error;
      }

      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/blog')}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>
          <h1 className="text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {isEdit ? 'Edit Post' : 'New Post'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent text-2xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Slug *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 text-sm">/blog/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                  required
                />
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                URL-friendly version of the title
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Excerpt *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                placeholder="Brief summary of the post (150-200 characters)"
                maxLength={200}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                required
              />
              <p className="text-xs text-neutral-500 mt-1">
                {formData.excerpt?.length || 0} / 200 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Featured Image *
              </label>
              {formData.image ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img
                      src={formData.image}
                      alt="Featured image preview"
                      className="h-48 w-auto rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-lg cursor-pointer hover:bg-neutral-200 transition-colors">
                      <Upload className="w-4 h-4" />
                      Replace
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-lg cursor-pointer hover:bg-neutral-200 transition-colors inline-flex">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
              <p className="text-xs text-neutral-500 mt-2">
                Upload a featured image (will be compressed to 500KB-1MB)
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <label className="block text-sm font-medium text-neutral-700 mb-4">
              Content *
            </label>
            <RichTextEditor
              content={formData.content || ''}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Start writing your blog post..."
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setSeoExpanded(!seoExpanded)}
              className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors"
            >
              <div>
                <h3 className="text-lg font-medium text-neutral-800 mb-1">
                  SEO Settings
                </h3>
                <p className="text-sm text-neutral-600">
                  Optimize your post for search engines and social media
                </p>
              </div>
              {seoExpanded ? (
                <ChevronUp className="w-5 h-5 text-neutral-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-600" />
              )}
            </button>

            {seoExpanded && (
              <div className="border-t border-neutral-200 p-6 space-y-6">
                <SEOPreview
                  title={formData.seo_title || formData.title || ''}
                  description={formData.seo_description || formData.excerpt || ''}
                  url={`yourdomain.com/blog/${formData.slug || 'post-slug'}`}
                />

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={formData.seo_title}
                      onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                      placeholder={formData.title || 'Leave blank to use post title'}
                      maxLength={60}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      {formData.seo_title?.length || 0} / 60 characters (leave blank to use post title)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.seo_description}
                      onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                      rows={3}
                      placeholder={formData.excerpt || 'Leave blank to use excerpt'}
                      maxLength={160}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      {formData.seo_description?.length || 0} / 160 characters (leave blank to use excerpt)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Focus Keyword
                    </label>
                    <input
                      type="text"
                      value={formData.seo_focus_keyword}
                      onChange={(e) => setFormData({ ...formData, seo_focus_keyword: e.target.value })}
                      placeholder="e.g., wedding photography tips"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      The main keyword you want to rank for
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.seo_keywords}
                      onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                      placeholder="wedding, photography, tips, guide"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      value={formData.canonical_url}
                      onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                      placeholder="https://yourdomain.com/blog/post-slug"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      The primary URL for this content (to prevent duplicate content issues)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Robots Meta
                    </label>
                    <select
                      value={formData.robots_meta}
                      onChange={(e) => setFormData({ ...formData, robots_meta: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                    >
                      <option value="index, follow">Index, Follow (Default)</option>
                      <option value="noindex, follow">No Index, Follow</option>
                      <option value="index, nofollow">Index, No Follow</option>
                      <option value="noindex, nofollow">No Index, No Follow</option>
                    </select>
                  </div>

                  <div className="border-t border-neutral-200 pt-6">
                    <h4 className="text-sm font-medium text-neutral-700 mb-4">
                      Open Graph (Facebook)
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          OG Title
                        </label>
                        <input
                          type="text"
                          value={formData.og_title}
                          onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                          placeholder="Leave blank to use SEO title"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          OG Description
                        </label>
                        <textarea
                          value={formData.og_description}
                          onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                          rows={2}
                          placeholder="Leave blank to use meta description"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          OG Image URL
                        </label>
                        <input
                          type="url"
                          value={formData.og_image}
                          onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                          placeholder="Leave blank to use featured image"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-6">
                    <h4 className="text-sm font-medium text-neutral-700 mb-4">
                      Twitter Card
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Twitter Title
                        </label>
                        <input
                          type="text"
                          value={formData.twitter_title}
                          onChange={(e) => setFormData({ ...formData, twitter_title: e.target.value })}
                          placeholder="Leave blank to use OG title"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Twitter Description
                        </label>
                        <textarea
                          value={formData.twitter_description}
                          onChange={(e) => setFormData({ ...formData, twitter_description: e.target.value })}
                          rows={2}
                          placeholder="Leave blank to use OG description"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-neutral-800 border-neutral-300 rounded focus:ring-2 focus:ring-neutral-800"
              />
              <label htmlFor="published" className="text-sm font-medium text-neutral-700">
                Publish this post
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex items-center gap-2 bg-maroon text-white px-6 py-3 rounded-lg hover:bg-maroon-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/blog')}
              className="px-6 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
