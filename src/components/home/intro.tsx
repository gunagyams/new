import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface HomepageImage {
  id: string;
  position: number;
  image_url: string;
  alt_text: string;
}

const Intro: React.FC = () => {
  const [images, setImages] = useState<HomepageImage[]>([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_images')
        .select('*')
        .in('position', [5, 8])
        .order('position', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching intro images:', error);
    }
  };

  const getImageUrl = (position: number, fallback: string): string => {
    const image = images.find(img => img.position === position);
    const url = image?.image_url || fallback;
    if (url.includes('supabase')) {
      return `${url}?t=${Date.now()}`;
    }
    return url;
  };

  const getImageAlt = (position: number, defaultAlt: string): string => {
    const image = images.find(img => img.position === position);
    return image?.alt_text || defaultAlt;
  };

  return (
    <section id="philosophy" className="py-24 md:py-40 px-6 md:px-12 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="block font-sans text-xs text-maroon uppercase tracking-[0.25em] mb-6">
            The Philosophy
          </span>
          <h3 className="font-serif italic text-4xl md:text-6xl text-charcoal leading-tight mb-8">
            Quiet beauty of<br />the unseen.
          </h3>
          <p className="font-sans text-charcoal/80 leading-relaxed max-w-md mb-8">
            We believe that the most profound moments are often the quietest.
            The slight tremble of a hand, the way light catches a veil, the
            fleeting glance shared across a crowded room. We are there to document
            the poetry of your day, not just the events.
          </p>
          <p className="font-sans text-charcoal/80 leading-relaxed max-w-md">
            Our approach is unobtrusive, editorial, and deeply rooted in a love
            for timeless aesthetics.
          </p>
        </motion.div>

        {/* Right: Image Composition */}
        <div className="relative h-[600px] w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="absolute top-0 right-0 w-3/4 h-[500px] overflow-hidden bg-sand"
          >
             <img
               src={getImageUrl(8, 'https://picsum.photos/id/250/600/800')}
               alt={getImageAlt(8, 'Main portrait')}
               className="w-full h-full object-cover"
             />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute bottom-0 left-0 w-1/2 h-[350px] overflow-hidden border-8 border-cream"
          >
            <img
               src={getImageUrl(5, 'https://picsum.photos/id/319/400/600')}
               alt={getImageAlt(5, 'Detail shot')}
               className="w-full h-full object-cover"
             />
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Intro;