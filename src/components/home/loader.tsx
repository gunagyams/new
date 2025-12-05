import React from 'react';
import { motion } from 'framer-motion';

const Loader: React.FC = () => {
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
          src="/assets/images/sf_logo.png"
          alt="SF Logo"
          className="w-32 h-32 md:w-48 md:h-48 object-contain"
        />
      </motion.div>
    </motion.div>
  );
};

export default Loader;