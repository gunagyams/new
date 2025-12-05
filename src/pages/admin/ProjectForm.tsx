import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Project } from '../../lib/types';
import { compressThumbnail, formatFileSize } from '../../lib/imageCompression';
import AdminLayout from '../../components/AdminLayout';
import { Save, ArrowLeft, Upload, Shuffle, X } from 'lucide-react';

const EVENT_TYPES = [
  'Punjabi Wedding',
  'Western Wedding',
  'Engagement',
  'Pre-Wedding',
  'Destination Wedding',
  'Other',
];

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    client_names: '',
    event_date: '',
    event_type: 'Punjabi Wedding',
    location: '',
    gallery_url: '',
    thumbnail_url: '',
    access_code: '',
    is_locked: false,
    featured: false,
    published: false,
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchProject();
    }
  }, [id, isEdit]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setFormData(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      alert('Failed to load project');
      navigate('/admin/projects');
    }
  };

  const generateAccessCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setFormData({ ...formData, access_code: code });
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
      const compressed = await compressThumbnail(file);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const filePath = `project-thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-thumbnails')
        .upload(filePath, compressed);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-thumbnails')
        .getPublicUrl(filePath);

      setFormData({ ...formData, thumbnail_url: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveThumbnail = async () => {
    if (!confirm('Are you sure you want to remove this thumbnail?')) return;

    try {
      if (formData.thumbnail_url) {
        const urlParts = formData.thumbnail_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `project-thumbnails/${fileName}`;

        await supabase.storage
          .from('project-thumbnails')
          .remove([filePath]);
      }

      setFormData({ ...formData, thumbnail_url: '' });
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
      };

      if (isEdit && id) {
        const { error } = await supabase
          .from('projects')
          .update(data)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([{
          ...data,
          created_at: new Date().toISOString(),
        }]);

        if (error) throw error;
      }

      navigate('/admin/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/projects')}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
          <h1 className="text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {isEdit ? 'Edit Project' : 'New Project'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Client Names
              </label>
              <input
                type="text"
                value={formData.client_names}
                onChange={(e) => setFormData({ ...formData, client_names: e.target.value })}
                placeholder="e.g., John & Jane"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Event Type
                </label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Vancouver, BC"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Brief description of the project"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                External Gallery URL *
              </label>
              <input
                type="url"
                value={formData.gallery_url}
                onChange={(e) => setFormData({ ...formData, gallery_url: e.target.value })}
                placeholder="https://photos.google.com/... or Dropbox link"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                required
              />
              <p className="text-xs text-neutral-500 mt-1">
                Link to Google Photos, Dropbox, or other external gallery service
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Thumbnail Image
              </label>
              {formData.thumbnail_url ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img
                      src={formData.thumbnail_url}
                      alt="Thumbnail preview"
                      className="h-32 w-auto rounded-lg object-cover"
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
                      onClick={handleRemoveThumbnail}
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
                  {uploading ? 'Uploading...' : 'Upload Thumbnail'}
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
                Upload a single thumbnail image (will be compressed to 200-300KB)
              </p>
            </div>

            <div className="border-t border-neutral-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="is_locked"
                  checked={formData.is_locked}
                  onChange={(e) => setFormData({ ...formData, is_locked: e.target.checked })}
                  className="w-4 h-4 text-neutral-800 border-neutral-300 rounded focus:ring-2 focus:ring-neutral-800"
                />
                <label htmlFor="is_locked" className="text-sm font-medium text-neutral-700">
                  Lock this gallery (requires access code)
                </label>
              </div>

              {formData.is_locked && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Access Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.access_code}
                      onChange={(e) => setFormData({ ...formData, access_code: e.target.value })}
                      placeholder="Enter access code"
                      className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={generateAccessCode}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
                    >
                      <Shuffle className="w-4 h-4" />
                      Generate
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Users will need this code to access the gallery
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-neutral-200 pt-6 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-neutral-800 border-neutral-300 rounded focus:ring-2 focus:ring-neutral-800"
                />
                <label htmlFor="featured" className="text-sm font-medium text-neutral-700">
                  Feature this project
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-neutral-800 border-neutral-300 rounded focus:ring-2 focus:ring-neutral-800"
                />
                <label htmlFor="published" className="text-sm font-medium text-neutral-700">
                  Publish this project
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex items-center gap-2 bg-maroon text-white px-6 py-3 rounded-lg hover:bg-maroon-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/projects')}
                className="px-6 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
