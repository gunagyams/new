import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Save, Loader2, Image as ImageIcon } from 'lucide-react';

interface AboutImage {
  id: string;
  image_key: string;
  image_url: string;
  alt_text: string;
  display_order: number;
}

const IMAGE_SECTIONS = [
  { key: 'hero', label: 'About Hero Image', description: 'Main banner image at the top of About page', page: 'About' },
  { key: 'story_main', label: 'Story Section Image', description: 'Large image next to the story text', page: 'About' },
  { key: 'gallery_1', label: 'Gallery Image 1', description: 'First image in the photo grid', page: 'About' },
  { key: 'gallery_2', label: 'Gallery Image 2', description: 'Second image in the photo grid', page: 'About' },
  { key: 'gallery_3', label: 'Gallery Image 3', description: 'Third image in the photo grid', page: 'About' },
  { key: 'gallery_4', label: 'Gallery Image 4', description: 'Fourth image in the photo grid', page: 'About' },
  { key: 'wedding_banner', label: 'Wedding Banner Image', description: 'Full-width cinematic section', page: 'About' },
  { key: 'stories_header', label: 'Stories Page Header', description: 'Header banner for Stories/Client Area page', page: 'Stories' },
  { key: 'blog_header', label: 'Blog Page Header', description: 'Header banner for Journal/Blog page', page: 'Blog' },
  { key: 'contact_header', label: 'Contact Page Header', description: 'Header banner for Contact page', page: 'Contact' },
];

export default function AboutImages() {
  const [images, setImages] = useState<Record<string, AboutImage>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('about_page_images')
        .select('*')
        .order('display_order');

      if (error) throw error;

      const imageMap: Record<string, AboutImage> = {};
      data?.forEach((img) => {
        imageMap[img.image_key] = img;
      });
      setImages(imageMap);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (imageKey: string, file: File) => {
    setUploading(imageKey);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Error: Not authenticated. Please log in again.');
        setUploading(null);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `page-${imageKey}-${Date.now()}.${fileExt}`;
      const filePath = `pages/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const currentImage = images[imageKey];
      if (currentImage) {
        const { error: updateError } = await supabase
          .from('about_page_images')
          .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
          .eq('image_key', imageKey);

        if (updateError) throw new Error(`Database update failed: ${updateError.message}`);
      } else {
        const { error: insertError } = await supabase
          .from('about_page_images')
          .insert({
            image_key: imageKey,
            image_url: publicUrl,
            alt_text: IMAGE_SECTIONS.find(s => s.key === imageKey)?.label || '',
            display_order: 0
          });

        if (insertError) throw new Error(`Database insert failed: ${insertError.message}`);
      }

      await loadImages();
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      alert(errorMessage);
    } finally {
      setUploading(null);
    }
  };

  const handleAltTextUpdate = async (imageKey: string, altText: string) => {
    setSaving(imageKey);
    try {
      const { error } = await supabase
        .from('about_page_images')
        .update({ alt_text: altText, updated_at: new Date().toISOString() })
        .eq('image_key', imageKey);

      if (error) throw error;

      setImages(prev => ({
        ...prev,
        [imageKey]: { ...prev[imageKey], alt_text: altText }
      }));

      alert('Alt text updated!');
    } catch (error) {
      console.error('Error updating alt text:', error);
      alert('Failed to update alt text');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Page Images</h1>
        <p className="text-neutral-600">Upload and manage images displayed across your website</p>
      </div>

      <div className="space-y-3">
        {IMAGE_SECTIONS.map((section) => {
          const image = images[section.key];
          return (
            <div key={section.key} className="bg-white border border-neutral-200 p-4 rounded shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {image?.image_url ? (
                    <img
                      src={image.image_url}
                      alt={image.alt_text || section.label}
                      className="w-20 h-20 object-cover rounded border border-neutral-200"
                    />
                  ) : (
                    <div className="w-20 h-20 flex items-center justify-center bg-neutral-50 rounded border border-neutral-200">
                      <ImageIcon className="w-6 h-6 text-neutral-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">{section.page}</span>
                    <h3 className="text-sm font-semibold text-neutral-900">{section.label}</h3>
                  </div>
                  <p className="text-neutral-500 text-xs mb-3">{section.description}</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Upload Image
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(section.key, file);
                          }}
                          className="block w-full text-xs text-neutral-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-maroon file:text-white hover:file:bg-maroon-dark cursor-pointer"
                          disabled={uploading === section.key}
                        />
                        {uploading === section.key && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Alt Text
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={image?.alt_text || ''}
                          onChange={(e) => {
                            setImages(prev => ({
                              ...prev,
                              [section.key]: { ...prev[section.key], alt_text: e.target.value }
                            }));
                          }}
                          className="flex-1 px-2 py-1.5 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:border-transparent"
                          placeholder="Describe image"
                        />
                        <button
                          onClick={() => image && handleAltTextUpdate(section.key, image.alt_text)}
                          disabled={saving === section.key || !image}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-maroon text-white rounded hover:bg-maroon-dark disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {saving === section.key ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Save className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-maroon-light/10 border border-maroon-light/30 rounded-lg">
        <h3 className="font-semibold text-neutral-900 mb-2">Image Tips</h3>
        <ul className="text-sm text-neutral-600 space-y-1 list-disc list-inside">
          <li>Header/Hero images work best with landscape format (recommended: 1920x1080px or larger)</li>
          <li>Gallery images should be high quality portraits (recommended: 1200x1600px minimum)</li>
          <li>Use JPG format for photographs to keep file sizes reasonable</li>
          <li>Always add descriptive alt text for accessibility and SEO</li>
          <li>Images update instantly on the website after upload</li>
        </ul>
      </div>
    </div>
  );
}
