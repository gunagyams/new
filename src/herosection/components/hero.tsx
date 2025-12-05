import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HERO_IMAGES_COL_1, HERO_IMAGES_COL_2, HERO_IMAGES_COL_3 } from '../constants';

// Flattens the array to pick specific images easily
const IMAGES = [...HERO_IMAGES_COL_1, ...HERO_IMAGES_COL_2, ...HERO_IMAGES_COL_3];

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax: Slightly adjusted for the shorter section height
  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yCenter = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, -180]);
  
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section 
      ref={containerRef} 
      className="relative bg-cream min-h-[160vh] md:min-h-[200vh] pt-28 pb-10 px-6 md:px-12 overflow-hidden"
    >
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 w-full">
        
        {/* --- LEFT COLUMN (Text + Tall Bride + Detail) --- */}
        <motion.div style={{ y: yLeft }} className="md:col-span-3 flex flex-col gap-10 md:mt-24 z-10">
           {/* Header Text */}
           <motion.div style={{ opacity: textOpacity }} className="text-center md:text-left hidden md:block">
              <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase leading-loose text-charcoal/80 border-l-2 border-maroon/30 pl-4">
                Editorial & <br/> Fine Art Photography
              </h2>
           </motion.div>
           
           {/* Image: Bride Portrait - TALL (aspect-[1/2]) */}
           <div className="w-full aspect-[1/2] relative group overflow-hidden">
              <img
                src={IMAGES[0].url}
                alt="Bride Portrait"
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
              />
           </div>
           
           {/* Image: Darker Detail (Smaller) */}
           <div className="w-3/4 aspect-square ml-auto relative group overflow-hidden mt-4">
               <img
                 src={IMAGES[8].url}
                 alt="Detail Shot"
                 className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
               />
               <span className="block md:hidden mt-2 font-serif italic text-xs text-charcoal/60 text-right">Fig. 03</span>
           </div>
        </motion.div>


        {/* --- CENTER COLUMN (Tall Main + Quote + Landscape) --- */}
        <motion.div style={{ y: yCenter }} className="md:col-span-6 flex flex-col items-center gap-12 z-20">
           
           {/* Main Hero Image - TALL (aspect-[2/3]) */}
           <div className="w-full aspect-[2/3] relative group shadow-sm hover:shadow-xl transition-shadow duration-500 bg-white p-2 md:p-4">
              <div className="w-full h-full overflow-hidden">
                <img
                  src={IMAGES[1].url}
                  alt="Couple Portrait"
                  priority="true"
                  className="w-full h-full object-cover transition-all duration-1000 ease-in-out transform group-hover:scale-105"
                />
              </div>
           </div>
           
           {/* Quote Block - Reduced padding */}
           <div className="max-w-md text-center py-8 px-4">
              <p className="font-serif italic text-2xl md:text-4xl text-charcoal leading-tight">
                "Let's create and capture memories through our lenses that you can cherish for life."
              </p>
           </div>
           
           {/* Secondary Image (Landscape/Sitting) */}
           <div className="w-10/12 aspect-[4/3] relative group overflow-hidden shadow-md">
               <img
                 src={IMAGES[4].url}
                 alt="Intimate Moment"
                 className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
               />
           </div>
        </motion.div>


        {/* --- RIGHT COLUMN (Text + Movement + Tall Nature) --- */}
        <motion.div style={{ y: yRight }} className="md:col-span-3 flex flex-col gap-12 md:mt-8 z-10">
           {/* Header Text */}
           <motion.div style={{ opacity: textOpacity }} className="text-center md:text-right hidden md:block">
              <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase leading-loose text-charcoal/80 border-r-2 border-maroon/30 pr-4">
                Love is forever, <br/> so are your photos
              </h2>
           </motion.div>
           
           {/* Image: Walking/Movement */}
           <div className="w-full aspect-[3/4] relative group overflow-hidden mt-0 md:mt-12">
               <img
                 src={IMAGES[5].url}
                 alt="Movement"
                 className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
               />
           </div>

           {/* Image: Nature/Landscape - TALL (aspect-[1/2]) */}
           <div className="w-full aspect-[1/2] relative group overflow-hidden -ml-8 md:ml-0 shadow-lg">
               <img
                 src={IMAGES[7].url}
                 alt="Landscape"
                 className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
               />
           </div>
        </motion.div>
      </div>

      {/* Mobile-only Text blocks */}
      <div className="md:hidden mt-12 text-center space-y-12 px-4">
          <div>
            <span className="block font-sans text-[10px] tracking-[0.3em] uppercase text-maroon mb-4">Editorial</span>
            <p className="font-serif italic text-2xl text-charcoal">We craft visual legacies.</p>
          </div>
          <div>
            <span className="block font-sans text-[10px] tracking-[0.3em] uppercase text-maroon mb-4">Timeless</span>
            <p className="font-serif italic text-2xl text-charcoal">Love stories told with grace.</p>
          </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream via-cream/60 to-transparent z-30 pointer-events-none" />
    </section>
  );
};

export default Hero;