import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Quote, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  display_order: number;
  published: boolean;
  created_at: string;
}

const EMPTY_FORM = {
  quote: '',
  author: '',
  location: '',
  display_order: 0,
  published: true,
};

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data) {
      setTestimonials(data);
    }
    setLoading(false);
  };

  const handleEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setFormData({
      quote: t.quote,
      author: t.author,
      location: t.location,
      display_order: t.display_order,
      published: t.published,
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      ...EMPTY_FORM,
      display_order: testimonials.length,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (editingId) {
      const { error } = await supabase
        .from('testimonials')
        .update({
          quote: formData.quote,
          author: formData.author,
          location: formData.location,
          display_order: formData.display_order,
          published: formData.published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId);

      if (!error) {
        setShowModal(false);
        fetchTestimonials();
      }
    } else {
      const { error } = await supabase.from('testimonials').insert({
        quote: formData.quote,
        author: formData.author,
        location: formData.location,
        display_order: formData.display_order,
        published: formData.published,
      });

      if (!error) {
        setShowModal(false);
        fetchTestimonials();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (!error) {
      setDeleteConfirm(null);
      fetchTestimonials();
    }
  };

  const togglePublished = async (t: Testimonial) => {
    await supabase
      .from('testimonials')
      .update({ published: !t.published, updated_at: new Date().toISOString() })
      .eq('id', t.id);
    fetchTestimonials();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-neutral-800 border-r-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Testimonials
            </h1>
            <p className="text-neutral-600 mt-1">
              Manage client reviews displayed on your homepage
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-neutral-800 text-white px-5 py-2.5 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <Plus size={18} />
            Add Review
          </button>
        </div>

        {testimonials.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Quote className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-700 mb-2">No testimonials yet</h3>
            <p className="text-neutral-500 mb-6">Add your first client review to display on the homepage.</p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 bg-neutral-800 text-white px-5 py-2.5 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              <Plus size={18} />
              Add Review
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className={`bg-white rounded-lg shadow-sm border transition-colors ${
                  t.published ? 'border-transparent' : 'border-orange-200 bg-orange-50/30'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1 text-neutral-300">
                      <GripVertical size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-neutral-800 font-serif italic leading-relaxed line-clamp-3 mb-3">
                        "{t.quote}"
                      </p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-medium text-neutral-700">{t.author}</span>
                        <span className="text-neutral-400">|</span>
                        <span className="text-neutral-500">{t.location}</span>
                        <span className="text-neutral-400">|</span>
                        <span className="text-neutral-400">Order: {t.display_order}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => togglePublished(t)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          t.published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                      >
                        {t.published ? 'Published' : 'Draft'}
                      </button>
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      {deleteConfirm === t.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 text-xs bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(t.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-neutral-800">
                {editingId ? 'Edit Review' : 'Add Review'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Quote *
                </label>
                <textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  required
                  rows={5}
                  placeholder="Enter the client's testimonial..."
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-400 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Author / Label *
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                    placeholder="e.g. Client Review, Wedding Couple"
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder="e.g. Kelowna, BC"
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    min={0}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.published ? 'published' : 'draft'}
                    onChange={(e) => setFormData({ ...formData, published: e.target.value === 'published' })}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-neutral-800 text-white py-2.5 px-4 rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Review' : 'Add Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
