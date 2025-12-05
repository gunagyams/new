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
        initial={{ letterSpacing: "0em", opacity: 0 }}
        animate={{ letterSpacing: "0.5em", opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <h1 className="font-serif italic text-4xl md:text-6xl text-charcoal">
          SYNCING FILMS
        </h1>
      </motion.div>
    </motion.div>
  );
};

export default Loader;