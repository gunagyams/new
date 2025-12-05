import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../../lib/homeConstants';

const Testimonials: React.FC = () => {
  return (
    <section className="relative py-32 md:py-48 bg-cream overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-maroon/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-sand rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">What Clients Say</h2>
          <div className="w-20 h-0.5 bg-maroon mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <p className="font-serif italic text-lg text-charcoal leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>
              <div className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal/70">
                <span className="block font-bold mb-1">{testimonial.author}</span>
                <span className="text-maroon">{testimonial.location}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;