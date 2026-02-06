import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { Project } from '../lib/types';
import { getPageSEO, type PageSEOSettings } from '../lib/seo';
import PasswordModal from '../components/PasswordModal';

export default function Stories() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [seoSettings, setSeoSettings] = useState<PageSEOSettings | null>(null);

  useEffect(() => {
    getPageSEO('stories').then(setSeoSettings);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('published', true)
        .order('event_date', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'Punjabi Wedding', label: 'Punjabi' },
    { id: 'Western Wedding', label: 'Western' },
    { id: 'Destination Wedding', label: 'Destination' },
    { id: 'Engagement', label: 'Engagement' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.event_type === selectedCategory);

  const handleProjectClick = (project: Project) => {
    if (project.is_locked) {
      setSelectedProject(project);
      setShowModal(true);
    } else if (project.gallery_url) {
      window.open(project.gallery_url, '_blank');
    }
  };

  const handlePasswordSuccess = (url: string) => {
    window.open(url, '_blank');
    setShowModal(false);
    setSelectedProject(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] pt-24 flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-maroon border-r-transparent"></div>
      </div>
    );
  }

  const pageTitle = seoSettings?.seo_title || 'Portfolio | SynCing Films';
  const pageDescription = seoSettings?.meta_description || 'Explore real wedding photography and videography stories captured across British Columbia by SynCing Films.';

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
            <h1 className="text-3xl tracking-[0.3em] uppercase text-neutral-800 mb-6 font-bold">Portfolio</h1>
            <p className="text-neutral-700 max-w-xl text-lg">
              Explore our collection of captured moments
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-center gap-4 mb-20 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-maroon text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-600">No projects available at this time.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden aspect-[3/4] mb-6">
                    {project.thumbnail_url ? (
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                        <span className="text-neutral-400">No image</span>
                      </div>
                    )}
                    {project.is_locked && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center">
                          <Lock className="w-8 h-8 mx-auto mb-3" />
                          <p className="text-xs tracking-wider uppercase">Private Gallery</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-2">
                      {project.event_type || 'Wedding'}
                    </h3>
                    <h4 className="text-2xl text-neutral-800" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                      {project.client_names || project.title}
                    </h4>
                    {project.event_date && (
                      <p className="text-sm text-neutral-500 mt-1">
                        {new Date(project.event_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedProject && (
        <PasswordModal
          project={selectedProject}
          isOpen={showModal}
          onClose={handleModalClose}
          onSuccess={handlePasswordSuccess}
        />
      )}
    </div>
  );
}
