import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Project } from '../../lib/types';

const Gallery: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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

    if (project.is_locked && project.access_code) {
      const enteredPassword = prompt('This gallery is password protected. Please enter the password:');

      if (enteredPassword === null) {
        return;
      }

      if (enteredPassword === project.access_code) {
        window.open(project.gallery_url, '_blank');
      } else {
        alert('Incorrect password. Please try again.');
      }
    } else {
      window.open(project.gallery_url, '_blank');
    }
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
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                onClick={() => handleProjectClick(project)}
                className={`relative overflow-hidden group cursor-pointer ${index % 2 === 0 ? 'md:mt-12' : ''}`}
              >
                <div className="aspect-[3/4] overflow-hidden bg-sand">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.client_names || project.title}
                      className="w-full h-full object-contain transition-all duration-700 ease-in-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-sand flex items-center justify-center">
                      <span className="text-charcoal/40">No image</span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
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
    </section>
  );
};

export default Gallery;
