import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const Loader: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState('/assets/images/sf_logo.png');

  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const { data } = await supabase
        .from('homepage_images')
        .select('image_url')
        .eq('position', 0)
        .maybeSingle();

      if (data?.image_url) {
        const url = data.image_url.includes('supabase')
          ? `${data.image_url}?t=${Date.now()}`
          : data.image_url;
        setLogoUrl(url);
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-cream"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <img
          src={logoUrl}
          alt="SF Logo"
          className="w-32 h-32 md:w-48 md:h-48 object-contain"
        />
      </motion.div>
    </motion.div>
  );
};

export default Loader;