import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Project } from '../../lib/types';
import PasswordModal from '../PasswordModal';

const Gallery: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('published', true)
        .order('event_date', { ascending: false })
        .limit(6);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project: Project) => {
    if (!project.gallery_url) {
      alert('Gallery link not available for this project.');
      return;
    }

    if (project.is_locked) {
      setSelectedProject(project);
      setShowModal(true);
    } else {
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
      <section id="gallery" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-charcoal border-r-transparent"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <span className="font-sans text-xs text-maroon uppercase tracking-[0.25em]">Selected Works</span>
          <h2 className="font-serif italic text-5xl mt-4 text-charcoal">Curated Moments</h2>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-charcoal/60">No projects available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px", amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                onClick={() => handleProjectClick(project)}
                className={`relative overflow-hidden group cursor-pointer ${index % 2 === 0 ? 'md:mt-12' : ''}`}
              >
                <div className="aspect-[3/4] overflow-hidden bg-sand">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.client_names || project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-sand flex items-center justify-center">
                      <span className="text-charcoal/40">No image</span>
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
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white">
                    <p className="font-sans text-[10px] tracking-[0.2em] uppercase mb-1">
                      {project.event_type || 'Wedding'}
                    </p>
                    <h3 className="font-serif italic text-xl">
                      {project.client_names || project.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedProject && (
        <PasswordModal
          project={selectedProject}
          isOpen={showModal}
          onClose={handleModalClose}
          onSuccess={handlePasswordSuccess}
        />
      )}
    </section>
  );
};

export default Gallery;
