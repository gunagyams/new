import React from 'react';
import { motion } from 'framer-motion';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 md:py-36 bg-sand/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center flex flex-col items-center group"
            >
              <div className="mb-6 p-4 rounded-full border border-charcoal/10 group-hover:border-maroon/50 transition-colors duration-500">
                <service.icon strokeWidth={1} size={32} className="text-charcoal group-hover:text-maroon transition-colors duration-500" />
              </div>
              <h3 className="font-serif italic text-2xl text-charcoal mb-4">{service.title}</h3>
              <p className="font-sans text-sm leading-relaxed text-charcoal/70 max-w-xs mx-auto">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;