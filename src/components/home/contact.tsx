import React from 'react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-cream border-t border-charcoal/5">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="font-serif italic text-5xl text-charcoal mb-4">Inquire</h2>
          <p className="font-sans text-charcoal/70">For the wildly in love. Tell us your story.</p>
        </div>

        <form className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative">
              <input
                type="text"
                id="name"
                required
                className="peer w-full border-b border-charcoal/20 bg-transparent py-2 text-charcoal focus:border-maroon focus:outline-none transition-colors"
                placeholder=" "
              />
              <label htmlFor="name" className="absolute left-0 top-2 -translate-y-6 text-xs text-charcoal/50 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-maroon uppercase tracking-wider">
                Name <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="email"
                id="email"
                required
                className="peer w-full border-b border-charcoal/20 bg-transparent py-2 text-charcoal focus:border-maroon focus:outline-none transition-colors"
                placeholder=" "
              />
              <label htmlFor="email" className="absolute left-0 top-2 -translate-y-6 text-xs text-charcoal/50 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-maroon uppercase tracking-wider">
                Email <span className="text-red-600">*</span>
              </label>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              id="date"
              required
              className="peer w-full border-b border-charcoal/20 bg-transparent py-2 text-charcoal focus:border-maroon focus:outline-none transition-colors"
              placeholder=" "
            />
            <label htmlFor="date" className="absolute left-0 top-2 -translate-y-6 text-xs text-charcoal/50 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-maroon uppercase tracking-wider">
              Event Date & Location <span className="text-red-600">*</span>
            </label>
          </div>

          <div className="relative">
            <textarea
              id="message"
              rows={4}
              required
              className="peer w-full border-b border-charcoal/20 bg-transparent py-2 text-charcoal focus:border-maroon focus:outline-none transition-colors resize-none"
              placeholder=" "
            ></textarea>
            <label htmlFor="message" className="absolute left-0 top-2 -translate-y-6 text-xs text-charcoal/50 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-maroon uppercase tracking-wider">
              Your Message <span className="text-red-600">*</span>
            </label>
          </div>

          <div className="text-center pt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-charcoal text-cream px-10 py-4 font-sans text-xs uppercase tracking-[0.2em] hover:bg-maroon transition-colors duration-300"
            >
              Send Inquiry
            </motion.button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;