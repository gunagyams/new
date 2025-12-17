import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { compressImage } from '../../lib/imageCompression';

interface HomepageImage {
  id: string;
  position: number;
  image_url: string;
  alt_text: string;
  created_at: string;
  updated_at: string;
}

const POSITION_LABELS = [
  'Hero: Left Column - Top (Tall)',
  'Hero: Center Column - Main',
  'Hero: Left Column - Detail',
  'Hero: Center Column - Secondary',
  'Hero: Center Column - Landscape',
  'Hero: Right Column - Movement',
  'Hero: Right Column - Nature',
  'Hero: Right Column - Tall',
  'Intro: Main Portrait (Right)',
  'Philosophy: Detail Shot (Left)'
];

export default function HomepageImages() {
  const [images, setImages] = useState<HomepageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchImages();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    if (!session) {
      setMessage('Warning: Not authenticated. Please log in to upload images.');
    }
  };

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_images')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      setMessage('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (position: number, file: File) => {
    try {
      setUploading(position);
      setMessage('');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessage('Error: Not authenticated. Please log in again.');
        setUploading(null);
        return;
      }

      const compressedFile = await compressImage(file);
      const fileExt = file.name.split('.').pop();
      const fileName = `homepage_${position}_${Date.now()}.${fileExt}`;
      const filePath = `homepage/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, compressedFile, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const existingImage = images.find(img => img.position === position);

      if (existingImage) {
        const { error: updateError } = await supabase
          .from('homepage_images')
          .update({
            image_url: publicUrl,
            updated_at: new Date().toISOString()
          })
          .eq('position', position);

        if (updateError) throw new Error(`Database update failed: ${updateError.message}`);
      } else {
        const { error: insertError } = await supabase
          .from('homepage_images')
          .insert({
            position,
            image_url: publicUrl,
            alt_text: POSITION_LABELS[position] || ''
          });

        if (insertError) throw new Error(`Database insert failed: ${insertError.message}`);
      }

      setMessage('Image uploaded successfully!');
      fetchImages();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      setMessage(errorMessage);
    } finally {
      setUploading(null);
    }
  };

  const handleDeleteImage = async (position: number, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      setLoading(true);

      if (imageUrl.includes('supabase')) {
        const path = imageUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('images').remove([path]);
      }

      const { error } = await supabase
        .from('homepage_images')
        .update({
          image_url: 'https://picsum.photos/600/800',
          updated_at: new Date().toISOString()
        })
        .eq('position', position);

      if (error) throw error;

      setMessage('Image deleted successfully!');
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      setMessage('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-charcoal border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif italic text-charcoal mb-2">Homepage Hero Images</h1>
          <p className="text-charcoal/60">
            Manage the images displayed in the homepage hero section. Images are arranged in a 3-column grid.
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded text-sm font-medium ${
          isAuthenticated
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {isAuthenticated ? '✓ Authenticated' : '✗ Not Authenticated'}
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg font-medium ${
          message.includes('success') ? 'bg-green-50 text-green-800 border-2 border-green-200' : 'bg-red-50 text-red-800 border-2 border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((position) => {
          const image = images.find(img => img.position === position);
          const isUploading = uploading === position;

          return (
            <div key={position} className="bg-white rounded border border-charcoal/10 overflow-hidden shadow-sm">
              <div className="p-2 bg-sand border-b border-charcoal/10">
                <h3 className="font-sans text-xs font-medium text-charcoal">
                  Pos {position + 1}
                </h3>
                <p className="text-[10px] text-charcoal/60 mt-0.5 line-clamp-1">
                  {POSITION_LABELS[position] || 'Hero Image'}
                </p>
              </div>

              <div className="aspect-[3/4] bg-sand relative">
                {image?.image_url ? (
                  <>
                    <img
                      src={image.image_url}
                      alt={image.alt_text || `Position ${position + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleDeleteImage(position, image.image_url)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      title="Delete image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={24} className="text-charcoal/20" />
                  </div>
                )}
              </div>

              <div className="p-2">
                <label className="block w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(position, file);
                    }}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <div className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded border-2 border-dashed transition-colors cursor-pointer ${
                    isUploading
                      ? 'bg-charcoal/5 border-charcoal/20 cursor-not-allowed'
                      : 'border-charcoal/30 hover:border-maroon hover:bg-maroon/5'
                  }`}>
                    {isUploading ? (
                      <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-charcoal border-r-transparent"></div>
                    ) : (
                      <>
                        <Upload size={12} className="text-charcoal/60" />
                        <span className="text-xs text-charcoal/60">
                          {image ? 'Replace' : 'Upload'}
                        </span>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-sans text-sm font-medium text-blue-900 mb-2">Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Images will be automatically compressed for optimal performance</li>
          <li>Recommended aspect ratio: Portrait orientation (3:4 or similar)</li>
          <li>For best results, use high-quality images with good resolution</li>
          <li>Changes take effect immediately on the live site</li>
        </ul>
      </div>
    </div>
  );
}
