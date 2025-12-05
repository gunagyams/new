import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIAL } from '../constants';

const Testimonials: React.FC = () => {
  return (
    <section className="relative py-32 md:py-48 bg-cream overflow-hidden flex items-center justify-center">
      {/* Background Animated Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-maroon/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-sand rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="font-serif italic text-3xl md:text-5xl text-charcoal leading-tight mb-12">
            "{TESTIMONIAL.quote}"
          </p>
          <div className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal">
            <span className="block font-bold mb-2">{TESTIMONIAL.author}</span>
            <span className="text-maroon">{TESTIMONIAL.location}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;