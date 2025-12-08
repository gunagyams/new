import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Loader: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/about_page_images?image_key=eq.site_logo&select=image_url`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data[0]?.image_url) {
          setLogoUrl(data[0].image_url);
        }
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
            <svg className="w-32 h-32 md:w-48 md:h-48 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Loader;