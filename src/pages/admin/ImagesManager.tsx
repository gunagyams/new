import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Upload, Save, Loader2, Trash2, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../../lib/imageCompression';

interface HomepageImage {
  id: string;
  position: number;
  image_url: string;
  alt_text: string;
}

interface AboutImage {
  id: string;
  image_key: string;
  image_url: string;
  alt_text: string;
}

interface LogoData {
  id?: string;
  image_key: string;
  image_url: string;
  alt_text: string;
}

const HOMEPAGE_POSITIONS = [
  { pos: 0, label: 'Hero Left Top' },
  { pos: 1, label: 'Hero Center Main' },
  { pos: 2, label: 'Hero Left Detail' },
  { pos: 3, label: 'Hero Center Secondary' },
  { pos: 4, label: 'Hero Center Landscape' },
  { pos: 5, label: 'Hero Right Movement' },
  { pos: 6, label: 'Hero Right Nature' },
  { pos: 7, label: 'Hero Right Tall' },
  { pos: 8, label: 'Intro Portrait' },
  { pos: 9, label: 'Intro Detail Shot' },
];

const ABOUT_IMAGES = [
  { key: 'hero', label: 'About Hero', page: 'About' },
  { key: 'story_main', label: 'Story Section', page: 'About' },
  { key: 'gallery_1', label: 'Gallery 1', page: 'About' },
  { key: 'gallery_2', label: 'Gallery 2', page: 'About' },
  { key: 'gallery_3', label: 'Gallery 3', page: 'About' },
  { key: 'gallery_4', label: 'Gallery 4', page: 'About' },
  { key: 'wedding_banner', label: 'Wedding Banner', page: 'About' },
];

export default function ImagesManager() {
  const [logoData, setLogoData] = useState<LogoData | null>(null);
  const [homepageImages, setHomepageImages] = useState<HomepageImage[]>([]);
  const [aboutImages, setAboutImages] = useState<Record<string, AboutImage>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAllImages();
  }, []);

  const loadAllImages = async () => {
    setLoading(true);
    try {
      const [logoRes, homepageRes, aboutRes] = await Promise.all([
        supabase.from('about_page_images').select('*').eq('image_key', 'site_logo').maybeSingle(),
        supabase.from('homepage_images').select('*').order('position', { ascending: true }),
        supabase.from('about_page_images').select('*').order('display_order')
      ]);

      if (logoRes.data) {
        setLogoData(logoRes.data);
      } else {
        setLogoData({ image_key: 'site_logo', image_url: '', alt_text: 'Site Logo' });
      }

      if (homepageRes.data) setHomepageImages(homepageRes.data);

      if (aboutRes.data) {
        const imageMap: Record<string, AboutImage> = {};
        aboutRes.data.forEach((img) => {
          if (img.image_key !== 'site_logo') {
            imageMap[img.image_key] = img;
          }
        });
        setAboutImages(imageMap);
      }
    } catch (error) {
      console.error('Error loading images:', error);
      setMessage('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    setUploading('logo');
    setMessage('');
    try {
      const compressedFile = await compressImage(file);
      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      const filePath = `site/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, compressedFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

      if (logoData?.id) {
        await supabase.from('about_page_images')
          .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
          .eq('image_key', 'site_logo');
      } else {
        await supabase.from('about_page_images')
          .insert({ image_key: 'site_logo', image_url: publicUrl, alt_text: 'Site Logo', display_order: -1 });
      }

      setMessage('Logo uploaded successfully!');
      loadAllImages();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading logo:', error);
      setMessage('Failed to upload logo');
    } finally {
      setUploading(null);
    }
  };

  const handleHomepageImageUpload = async (position: number, file: File) => {
    setUploading(`homepage_${position}`);
    setMessage('');
    try {
      const compressedFile = await compressImage(file);
      const fileExt = file.name.split('.').pop();
      const fileName = `homepage_${position}_${Date.now()}.${fileExt}`;
      const filePath = `homepage/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, compressedFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

      const existingImage = homepageImages.find(img => img.position === position);

      if (existingImage) {
        await supabase.from('homepage_images')
          .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
          .eq('position', position);
      } else {
        await supabase.from('homepage_images')
          .insert({ position, image_url: publicUrl, alt_text: HOMEPAGE_POSITIONS[position]?.label || '' });
      }

      setMessage('Homepage image uploaded successfully!');
      loadAllImages();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading homepage image:', error);
      setMessage('Failed to upload homepage image');
    } finally {
      setUploading(null);
    }
  };

  const handleAboutImageUpload = async (imageKey: string, file: File) => {
    setUploading(`about_${imageKey}`);
    setMessage('');
    try {
      const compressedFile = await compressImage(file);
      const fileExt = file.name.split('.').pop();
      const fileName = `page-${imageKey}-${Date.now()}.${fileExt}`;
      const filePath = `pages/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, compressedFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

      const currentImage = aboutImages[imageKey];
      if (currentImage) {
        await supabase.from('about_page_images')
          .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
          .eq('image_key', imageKey);
      } else {
        await supabase.from('about_page_images')
          .insert({
            image_key: imageKey,
            image_url: publicUrl,
            alt_text: ABOUT_IMAGES.find(s => s.key === imageKey)?.label || '',
            display_order: 0
          });
      }

      setMessage('Page image uploaded successfully!');
      loadAllImages();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading page image:', error);
      setMessage('Failed to upload page image');
    } finally {
      setUploading(null);
    }
  };

  const handleDeleteHomepageImage = async (position: number, imageUrl: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      if (imageUrl.includes('supabase')) {
        const path = imageUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('images').remove([path]);
      }

      await supabase.from('homepage_images')
        .update({ image_url: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg', updated_at: new Date().toISOString() })
        .eq('position', position);

      setMessage('Image deleted!');
      loadAllImages();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting image:', error);
      setMessage('Failed to delete image');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <h1 className="text-3xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Images</h1>

        {message && (
          <div className={`p-3 mb-6 rounded text-sm ${
            message.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-8">
          <section className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-neutral-900">Site Logo</h2>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 flex-shrink-0 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-center overflow-hidden">
                {logoData?.image_url ? (
                  <img src={logoData.image_url} alt={logoData.alt_text} className="w-full h-full object-contain p-2" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-neutral-300" />
                )}
              </div>
              <div className="flex-1">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                    disabled={uploading === 'logo'}
                    className="block w-full text-sm text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer disabled:opacity-50"
                  />
                </label>
                {uploading === 'logo' && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-neutral-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-neutral-900">Homepage Hero Images</h2>
            <div className="space-y-2">
              {HOMEPAGE_POSITIONS.map(({ pos, label }) => {
                const image = homepageImages.find(img => img.position === pos);
                const uploadId = `homepage_${pos}`;
                const isUploading = uploading === uploadId;

                return (
                  <div key={pos} className="flex items-center gap-3 p-3 border border-neutral-200 rounded hover:bg-neutral-50">
                    <div className="w-16 h-16 flex-shrink-0 bg-neutral-100 rounded overflow-hidden">
                      {image?.image_url ? (
                        <img src={image.image_url} alt={image.alt_text} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-neutral-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-neutral-900">Position {pos + 1}</div>
                      <div className="text-xs text-neutral-500">{label}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {image?.image_url && (
                        <button
                          onClick={() => handleDeleteHomepageImage(pos, image.image_url)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <label className="flex-shrink-0">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleHomepageImageUpload(pos, file);
                          }}
                          disabled={isUploading}
                          className="hidden"
                        />
                        <div className={`px-4 py-2 text-xs font-medium rounded cursor-pointer transition-colors ${
                          isUploading
                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                            : 'bg-neutral-800 text-white hover:bg-neutral-700'
                        }`}>
                          {isUploading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Uploading...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Upload className="w-3 h-3" />
                              {image ? 'Replace' : 'Upload'}
                            </span>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-neutral-900">Page Images</h2>
            <div className="space-y-2">
              {ABOUT_IMAGES.map(({ key, label, page }) => {
                const image = aboutImages[key];
                const uploadId = `about_${key}`;
                const isUploading = uploading === uploadId;

                return (
                  <div key={key} className="flex items-center gap-3 p-3 border border-neutral-200 rounded hover:bg-neutral-50">
                    <div className="w-16 h-16 flex-shrink-0 bg-neutral-100 rounded overflow-hidden">
                      {image?.image_url ? (
                        <img src={image.image_url} alt={image.alt_text} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-neutral-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">{page}</span>
                        <span className="text-sm font-medium text-neutral-900">{label}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex-shrink-0">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAboutImageUpload(key, file);
                          }}
                          disabled={isUploading}
                          className="hidden"
                        />
                        <div className={`px-4 py-2 text-xs font-medium rounded cursor-pointer transition-colors ${
                          isUploading
                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                            : 'bg-neutral-800 text-white hover:bg-neutral-700'
                        }`}>
                          {isUploading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Uploading...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Upload className="w-3 h-3" />
                              {image ? 'Replace' : 'Upload'}
                            </span>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Tips:</h3>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>All images are automatically compressed for optimal performance</li>
            <li>Logo should be PNG with transparent background (recommended: 200x200px)</li>
            <li>Homepage images work best in portrait orientation (3:4 ratio)</li>
            <li>Page headers work best in landscape format (1920x1080px or larger)</li>
            <li>Changes take effect immediately on the live site</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
