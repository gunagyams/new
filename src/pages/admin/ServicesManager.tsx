import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, X, Image, Film as FilmIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadImage } from '../../lib/storage';
import AdminLayout from '../../components/AdminLayout';

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface SectionBackground {
  id: string;
  section_key: string;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  overlay_opacity: number;
}

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [background, setBackground] = useState<SectionBackground | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: 'Camera',
    display_order: 0,
    published: true,
  });

  const [backgroundForm, setBackgroundForm] = useState({
    media_url: '',
    media_type: null as 'image' | 'video' | null,
    overlay_opacity: 0.5,
  });

  const iconOptions = ['Camera', 'Film', 'Heart', 'Sparkles', 'Award', 'Users'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, backgroundRes] = await Promise.all([
        supabase
          .from('services')
          .select('*')
          .order('display_order', { ascending: true }),
        supabase
          .from('section_backgrounds')
          .select('*')
          .eq('section_key', 'services')
          .maybeSingle(),
      ]);

      if (servicesRes.error) throw servicesRes.error;
      setServices(servicesRes.data || []);

      if (backgroundRes.data) {
        setBackground(backgroundRes.data);
        setBackgroundForm({
          media_url: backgroundRes.data.media_url || '',
          media_type: backgroundRes.data.media_type,
          overlay_opacity: backgroundRes.data.overlay_opacity,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      alert('Please upload an image or video file');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadImage({
        bucket: 'section-media',
        file,
        path: `services-background-${Date.now()}`,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      setBackgroundForm({
        ...backgroundForm,
        media_url: result.url,
        media_type: isVideo ? 'video' : 'image',
      });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBackground = async () => {
    setLoading(true);
    try {
      if (background) {
        const { error } = await supabase
          .from('section_backgrounds')
          .update({
            media_url: backgroundForm.media_url,
            media_type: backgroundForm.media_type,
            overlay_opacity: backgroundForm.overlay_opacity,
            updated_at: new Date().toISOString(),
          })
          .eq('id', background.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('section_backgrounds')
          .insert([{
            section_key: 'services',
            media_url: backgroundForm.media_url,
            media_type: backgroundForm.media_type,
            overlay_opacity: backgroundForm.overlay_opacity,
          }]);

        if (error) throw error;
      }

      await fetchData();
      alert('Background saved successfully');
    } catch (error) {
      console.error('Error saving background:', error);
      alert('Failed to save background');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBackground = async () => {
    if (!background) return;
    if (!confirm('Remove background media?')) return;

    try {
      const { error } = await supabase
        .from('section_backgrounds')
        .update({
          media_url: null,
          media_type: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', background.id);

      if (error) throw error;

      setBackgroundForm({
        media_url: '',
        media_type: null,
        overlay_opacity: 0.5,
      });
      await fetchData();
    } catch (error) {
      console.error('Error removing background:', error);
      alert('Failed to remove background');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingService.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert([formData]);

        if (error) throw error;
      }

      await fetchData();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon_name: service.icon_name,
      display_order: service.display_order,
      published: service.published,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon_name: 'Camera',
      display_order: services.length,
      published: true,
    });
  };

  const handleCloseModal = () => {
    resetForm();
    setShowModal(false);
  };

  if (loading && services.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-800 border-r-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Manage your service offerings and section background</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Section Background</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Media (Image or Video)
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                    <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-sm text-gray-600">
                      {uploading ? 'Uploading...' : 'Click to upload background image or video'}
                    </p>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleBackgroundUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </div>
                </label>
              </div>

              {backgroundForm.media_url && (
                <div className="relative">
                  {backgroundForm.media_type === 'video' ? (
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                      <video
                        src={backgroundForm.media_url}
                        controls
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <FilmIcon size={12} />
                        Video Background
                      </div>
                    </div>
                  ) : (
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={backgroundForm.media_url}
                        alt="Background preview"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Image size={12} />
                        Image Background
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveBackground}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded hover:bg-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overlay Opacity: {backgroundForm.overlay_opacity}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={backgroundForm.overlay_opacity}
              onChange={(e) =>
                setBackgroundForm({ ...backgroundForm, overlay_opacity: parseFloat(e.target.value) })
              }
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Controls the darkness of the overlay on top of the background
            </p>
          </div>

          <button
            onClick={handleSaveBackground}
            disabled={loading || uploading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Background'}
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                    <p className="text-sm text-gray-500">
                      Icon: {service.icon_name} • Order: {service.display_order}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        service.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {service.published ? 'Published' : 'Draft'}
                    </span>
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No services yet. Add your first service!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingService ? 'Edit Service' : 'Add Service'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <select
                  value={formData.icon_name}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({ ...formData, display_order: parseInt(e.target.value) })
                    }
                    min={0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.published ? 'published' : 'draft'}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.value === 'published' })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
