import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { TESTIMONIALS as FALLBACK_TESTIMONIALS } from '../../lib/homeConstants';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isPaused = useRef(false);
  const scrollPos = useRef(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('id, quote, author, location')
        .eq('published', true)
        .order('display_order', { ascending: true });

      if (data && data.length > 0) {
        setTestimonials(data);
      } else {
        setTestimonials(FALLBACK_TESTIMONIALS);
      }
    };
    fetchTestimonials();
  }, []);

  const animate = useCallback(() => {
    if (!scrollRef.current || isPaused.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    scrollPos.current += 0.5;
    const container = scrollRef.current;
    const halfWidth = container.scrollWidth / 2;

    if (scrollPos.current >= halfWidth) {
      scrollPos.current = 0;
    }

    container.style.transform = `translateX(-${scrollPos.current}px)`;
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [testimonials, animate]);

  const doubled = testimonials.length > 0 ? [...testimonials, ...testimonials] : [];

  return (
    <section className="relative py-32 md:py-48 bg-cream overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-maroon/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-sand rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16 px-6"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">What Clients Say</h2>
          <div className="w-20 h-0.5 bg-maroon mx-auto"></div>
        </motion.div>

        <div
          className="overflow-hidden"
          onMouseEnter={() => { isPaused.current = true; }}
          onMouseLeave={() => { isPaused.current = false; }}
        >
          <div
            ref={scrollRef}
            className="flex gap-8 will-change-transform"
            style={{ width: 'max-content', paddingLeft: '2rem', paddingRight: '2rem' }}
          >
            {doubled.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="bg-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-[380px] md:w-[420px]"
              >
                <p className="font-serif italic text-lg text-charcoal leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal/70">
                  <span className="block font-bold mb-1">{testimonial.author}</span>
                  <span className="text-maroon">{testimonial.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
