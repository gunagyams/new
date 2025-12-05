import { useState, useEffect } from 'react';
import { Lock, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { Project } from '../lib/types';
import { getPageSEO, type PageSEOSettings } from '../lib/seo';

interface HeaderImage {
  image_url: string;
  alt_text: string;
}

export default function Stories() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [seoSettings, setSeoSettings] = useState<PageSEOSettings | null>(null);
  const [headerImage, setHeaderImage] = useState<HeaderImage | null>(null);

  useEffect(() => {
    getPageSEO('stories').then(setSeoSettings);
    loadHeaderImage();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  const loadHeaderImage = async () => {
    try {
      const { data, error } = await supabase
        .from('about_page_images')
        .select('image_url, alt_text')
        .eq('image_key', 'stories_header')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        const url = data.image_url.includes('supabase')
          ? `${data.image_url}?t=${Date.now()}`
          : data.image_url;
        setHeaderImage({ ...data, image_url: url });
      }
    } catch (error) {
      console.error('Error loading header image:', error);
    }
  };

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
      setError('');
      setAccessCode('');
    } else if (project.gallery_url) {
      window.open(project.gallery_url, '_blank');
    }
  };

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedProject && accessCode.toLowerCase() === selectedProject.access_code?.toLowerCase()) {
      if (selectedProject.gallery_url) {
        window.open(selectedProject.gallery_url, '_blank');
      }
      setShowModal(false);
      setAccessCode('');
      setSelectedProject(null);
    } else {
      setError('Invalid access code. Please try again or contact us for assistance.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] pt-24 flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-maroon border-r-transparent"></div>
      </div>
    );
  }

  const pageTitle = seoSettings?.seo_title || 'Our Photography Portfolio';
  const pageDescription = seoSettings?.meta_description || 'Explore our collection of stunning photography projects and client stories.';

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
      <div className="relative h-[300px] bg-neutral-100">
        <img
          src={headerImage?.image_url || '/assets/images/hero-2.jpg'}
          alt={headerImage?.alt_text || 'Wedding stories'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-xs tracking-[0.3em] uppercase text-white mb-3">Portfolio</h1>
            <p className="text-white/90 max-w-xl text-sm">
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

      {showModal && selectedProject && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-12 relative">
            <button
              onClick={() => {
                setShowModal(false);
                setAccessCode('');
                setError('');
                setSelectedProject(null);
              }}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-neutral-100 flex items-center justify-center">
                <Lock className="w-8 h-8 text-neutral-600" />
              </div>
            </div>
            <h3 className="text-xs tracking-[0.3em] uppercase text-neutral-500 text-center mb-3">
              Private Gallery
            </h3>
            <p className="text-2xl text-center mb-6 text-neutral-800" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
              {selectedProject.client_names || selectedProject.title}
            </p>
            <p className="text-sm text-neutral-500 text-center mb-8 leading-relaxed">
              This gallery is password protected. Please enter your access code to view the photos.
            </p>
            <form onSubmit={handleAccessSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    setError('');
                  }}
                  required
                  className="w-full px-4 py-4 border border-neutral-300 text-sm focus:border-maroon focus:outline-none uppercase tracking-wider text-center"
                  placeholder="ENTER ACCESS CODE"
                />
                {error && (
                  <p className="text-red-600 text-xs mt-2 text-center">{error}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-maroon hover:bg-maroon-dark text-white py-4 text-xs tracking-[0.2em] uppercase transition-colors"
              >
                View Gallery
              </button>
            </form>
            <p className="text-xs text-neutral-500 text-center mt-6">
              Need help? <a href="/contact" className="text-maroon hover:underline">Contact us</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
