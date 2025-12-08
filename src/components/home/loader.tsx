import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Camera } from 'lucide-react';

const Loader: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const { data } = await supabase
        .from('about_page_images')
        .select('image_url')
        .eq('image_key', 'site_logo')
        .maybeSingle();

      if (data?.image_url) {
        setLogoUrl(data.image_url);
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
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Site Logo"
            className="w-32 h-32 md:w-48 md:h-48 object-contain"
          />
        ) : (
          <div className="flex items-center justify-center">
            <Camera className="w-32 h-32 md:w-48 md:h-48 text-maroon" />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Loader;