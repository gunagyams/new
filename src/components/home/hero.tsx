import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface HomepageImage {
  id: string;
  position: number;
  image_url: string;
  alt_text: string;
}

const Hero: React.FC = () => {
  const [images, setImages] = useState<HomepageImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_images')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching homepage images:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (position: number): string => {
    const image = images.find(img => img.position === position);
    const url = image?.image_url || 'https://picsum.photos/600/800';
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
    <section
      className="relative bg-cream min-h-[120vh] md:min-h-[200vh] pt-28 pb-10 px-3 md:px-12 overflow-hidden"
    >
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-charcoal border-r-transparent"></div>
        </div>
      ) : (
        <>
      <div className="max-w-[1800px] mx-auto grid grid-cols-12 gap-3 md:gap-10 w-full">

        {/* --- LEFT COLUMN (Text + Tall Bride + Detail) --- */}
        <div className="col-span-3 flex flex-col gap-4 md:gap-10 mt-12 md:mt-24 z-10">
           {/* Header Text */}
           <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
             className="text-left"
           >
              <h2 className="font-sans text-[6px] md:text-[10px] tracking-[0.3em] uppercase leading-loose text-charcoal/80 border-l-2 border-maroon/30 pl-2 md:pl-4">
                Timeless Elegance <br/> Captured Forever
              </h2>
           </motion.div>

           {/* Image: Bride Portrait - TALL (aspect-[1/2]) */}
           <motion.div
             initial={{ opacity: 0, y: 50, scale: 0.95 }}
             whileInView={{ opacity: 1, y: 0, scale: 1 }}
             viewport={{ once: true, amount: 0.2 }}
             transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
             className="w-full aspect-[1/2] relative group overflow-hidden"
           >
              <img
                src={getImageUrl(0)}
                alt={getImageAlt(0, "Bride Portrait")}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
              />
           </motion.div>

           {/* Image: Darker Detail (Smaller) */}
           <motion.div
             initial={{ opacity: 0, y: 40, scale: 0.9 }}
             whileInView={{ opacity: 1, y: 0, scale: 1 }}
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
             className="w-3/4 aspect-square ml-auto relative group overflow-hidden mt-2 md:mt-4"
           >
               <img
                 src={getImageUrl(2)}
                 alt={getImageAlt(2, "Detail Shot")}
                 decoding="async"
                 className="w-full h-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
               />
           </motion.div>
        </div>


        {/* --- CENTER COLUMN (Tall Main + Quote + Landscape) --- */}
        <div className="col-span-6 flex flex-col items-center gap-6 md:gap-12 z-20">

           {/* Main Hero Image - TALL (aspect-[2/3]) */}
           <motion.div
             initial={{ opacity: 0, scale: 0.9, y: 60 }}
             whileInView={{ opacity: 1, scale: 1, y: 0 }}
             viewport={{ once: true, amount: 0.2 }}
             transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
             className="w-10/12 aspect-[3/4] relative group shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden"
           >
              <img
                src={getImageUrl(1)}
                alt={getImageAlt(1, "Couple Portrait")}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out will-change-transform group-hover:scale-105"
              />
           </motion.div>

           {/* Quote Block - Reduced padding */}
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, amount: 0.5 }}
             transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
             className="max-w-md text-center py-4 md:py-8 px-2 md:px-4"
           >
              <p className="font-serif italic text-sm md:text-4xl text-charcoal leading-tight">
                "For moments that deserve to be remembered exactly as they felt"
              </p>
           </motion.div>

           {/* Secondary Image (Landscape/Sitting) */}
           <motion.div
             initial={{ opacity: 0, y: 50, scale: 0.95 }}
             whileInView={{ opacity: 1, y: 0, scale: 1 }}
             viewport={{ once: true, amount: 0.2 }}
             transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
             className="w-10/12 aspect-[4/3] relative group overflow-hidden shadow-md"
           >
               <img
                 src={getImageUrl(4)}
                 alt={getImageAlt(4, "Intimate Moment")}
                 decoding="async"
                 className="w-full h-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
               />
           </motion.div>
        </div>


        {/* --- RIGHT COLUMN (Text + Movement + Tall Nature) --- */}
        <div className="col-span-3 flex flex-col gap-6 md:gap-12 mt-4 md:mt-8 z-10">
           {/* Header Text */}
           <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
             className="text-right"
           >
              <h2 className="font-sans text-[6px] md:text-[10px] tracking-[0.3em] uppercase leading-loose text-charcoal/80 border-r-2 border-maroon/30 pr-2 md:pr-4">
                Moments become <br/> Memories, Forever
              </h2>
           </motion.div>

           {/* Image: Walking/Movement */}
           <motion.div
             initial={{ opacity: 0, y: 50, scale: 0.95 }}
             whileInView={{ opacity: 1, y: 0, scale: 1 }}
             viewport={{ once: true, amount: 0.2 }}
             transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
             className="w-full aspect-[3/4] relative group overflow-hidden mt-0 md:mt-12"
           >
               <img
                 src={getImageUrl(5)}
                 alt={getImageAlt(5, "Movement")}
                 decoding="async"
                 className="w-full h-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
               />
           </motion.div>

           {/* Image: Nature/Landscape - TALL (aspect-[1/2]) */}
           <motion.div
             initial={{ opacity: 0, y: 40, scale: 0.9 }}
             whileInView={{ opacity: 1, y: 0, scale: 1 }}
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
             className="w-full aspect-[1/2] relative group overflow-hidden shadow-lg"
           >
               <img
                 src={getImageUrl(6)}
                 alt={getImageAlt(6, "Landscape")}
                 decoding="async"
                 className="w-full h-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
               />
           </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream via-cream/60 to-transparent z-30 pointer-events-none" />
      </>
      )}
    </section>
  );
};

export default Hero;