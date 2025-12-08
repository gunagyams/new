import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface HomepageImage {
  id: string;
  position: number;
  image_url: string;
  alt_text: string;
}

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [images, setImages] = useState<HomepageImage[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yCenter = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, -180]);

  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

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
      ref={containerRef}
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
        <motion.div style={{ y: yLeft }} className="col-span-3 flex flex-col gap-4 md:gap-10 mt-12 md:mt-24 z-10">
           {/* Header Text */}
           <motion.div style={{ opacity: textOpacity }} className="text-left">
              <h2 className="font-sans text-[6px] md:text-[10px] tracking-[0.3em] uppercase leading-loose text-charcoal/80 border-l-2 border-maroon/30 pl-2 md:pl-4">
                Timeless Elegance <br/> Captured Forever
              </h2>
           </motion.div>
           
           {/* Image: Bride Portrait - TALL (aspect-[1/2]) */}
           <div className="w-full aspect-[1/2] relative group overflow-hidden">
              <img
                src={getImageUrl(2)}
                alt={getImageAlt(2, "Bride Portrait")}
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
              />
           </div>

           {/* Image: Darker Detail (Smaller) */}
           <div className="w-3/4 aspect-square ml-auto relative group overflow-hidden mt-2 md:mt-4">
               <img
                 src={getImageUrl(3)}
                 alt={getImageAlt(3, "Detail Shot")}
                 className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
               />
           </div>
        </motion.div>


        {/* --- CENTER COLUMN (Tall Main + Quote + Landscape) --- */}
        <motion.div style={{ y: yCenter }} className="col-span-6 flex flex-col items-center gap-6 md:gap-12 z-20">

           {/* Main Hero Image - TALL (aspect-[2/3]) */}
           <div className="w-10/12 aspect-[3/4] relative group shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
              <img
                src={getImageUrl(1)}
                alt={getImageAlt(1, "Couple Portrait")}
                className="w-full h-full object-cover transition-all duration-1000 ease-in-out transform group-hover:scale-105"
              />
           </div>

           {/* Quote Block - Reduced padding */}
           <div className="max-w-md text-center py-4 md:py-8 px-2 md:px-4">
              <p className="font-serif italic text-sm md:text-4xl text-charcoal leading-tight">
                "Let's create and capture memories through our lenses that you can cherish for life."
              </p>
           </div>

           {/* Secondary Image (Landscape/Sitting) */}
           <div className="w-10/12 aspect-[4/3] relative group overflow-hidden shadow-md">
               <img
                 src={getImageUrl(4)}
                 alt={getImageAlt(4, "Intimate Moment")}
                 className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
               />
           </div>
        </motion.div>


        {/* --- RIGHT COLUMN (Text + Movement + Tall Nature) --- */}
        <motion.div style={{ y: yRight }} className="col-span-3 flex flex-col gap-6 md:gap-12 mt-4 md:mt-8 z-10">
           {/* Header Text */}
           <motion.div style={{ opacity: textOpacity }} className="text-right">
              <h2 className="font-sans text-[6px] md:text-[10px] tracking-[0.3em] uppercase leading-loose text-charcoal/80 border-r-2 border-maroon/30 pr-2 md:pr-4">
                Moments become <br/> Memories, Forever
              </h2>
           </motion.div>

           {/* Image: Walking/Movement */}
           <div className="w-full aspect-[3/4] relative group overflow-hidden mt-0 md:mt-12">
               <img
                 src={getImageUrl(7)}
                 alt={getImageAlt(7, "Movement")}
                 className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
               />
           </div>

           {/* Image: Nature/Landscape - TALL (aspect-[1/2]) */}
           <div className="w-full aspect-[1/2] relative group overflow-hidden shadow-lg">
               <img
                 src={getImageUrl(6)}
                 alt={getImageAlt(6, "Landscape")}
                 className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
               />
           </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream via-cream/60 to-transparent z-30 pointer-events-none" />
      </>
      )}
    </section>
  );
};

export default Hero;