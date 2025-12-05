import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Project } from '../../lib/types';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Lock, Unlock, Eye, EyeOff } from 'lucide-react';

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'locked'>('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const togglePublished = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ published: !project.published })
        .eq('id', project.id);

      if (error) throw error;
      setProjects(
        projects.map((p) =>
          p.id === project.id ? { ...p, published: !p.published } : p
        )
      );
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const toggleLocked = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_locked: !project.is_locked })
        .eq('id', project.id);

      if (error) throw error;
      setProjects(
        projects.map((p) =>
          p.id === project.id ? { ...p, is_locked: !p.is_locked } : p
        )
      );
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === 'published') return project.published;
    if (filter === 'draft') return !project.published;
    if (filter === 'locked') return project.is_locked;
    return true;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-maroon border-r-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Projects
            </h1>
            <p className="text-neutral-600">{filteredProjects.length} total projects</p>
          </div>
          <Link
            to="/admin/projects/new"
            className="flex items-center gap-2 bg-maroon text-white px-6 py-3 rounded-lg hover:bg-maroon-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Project
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex gap-2 p-4 border-b border-neutral-200">
            {['all', 'published', 'draft', 'locked'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                  filter === f
                    ? 'bg-maroon text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-neutral-600 mb-4">No projects found</p>
            <Link
              to="/admin/projects/new"
              className="inline-flex items-center gap-2 text-neutral-800 hover:underline"
            >
              <Plus className="w-4 h-4" />
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-[4/3] bg-neutral-200 relative">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-400">
                      No thumbnail
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    {project.is_locked && (
                      <div className="bg-orange-500 text-white p-1.5 rounded">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                    {project.published ? (
                      <div className="bg-green-500 text-white p-1.5 rounded">
                        <Eye className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="bg-neutral-500 text-white p-1.5 rounded">
                        <EyeOff className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {project.title}
                  </h3>
                  {project.client_names && (
                    <p className="text-sm text-neutral-600 mb-2">{project.client_names}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
                    {project.event_type && (
                      <span className="bg-neutral-100 px-2 py-1 rounded">{project.event_type}</span>
                    )}
                    {project.event_date && (
                      <span>{new Date(project.event_date).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/projects/${project.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => togglePublished(project)}
                      className="p-2 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
                      title={project.published ? 'Unpublish' : 'Publish'}
                    >
                      {project.published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleLocked(project)}
                      className="p-2 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
                      title={project.is_locked ? 'Unlock' : 'Lock'}
                    >
                      {project.is_locked ? (
                        <Unlock className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
