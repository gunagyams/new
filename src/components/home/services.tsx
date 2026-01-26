import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Film, Heart, Sparkles, Award, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  published: boolean;
}

interface SectionBackground {
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  overlay_opacity: number;
}

const iconMap: Record<string, React.ElementType> = {
  Camera,
  Film,
  Heart,
  Sparkles,
  Award,
  Users,
};

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [background, setBackground] = useState<SectionBackground | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, backgroundRes] = await Promise.all([
        supabase
          .from('services')
          .select('*')
          .eq('published', true)
          .order('display_order', { ascending: true }),
        supabase
          .from('section_backgrounds')
          .select('*')
          .eq('section_key', 'services')
          .maybeSingle(),
      ]);

      if (servicesRes.error) throw servicesRes.error;
      setServices(servicesRes.data || []);
      setBackground(backgroundRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="services" className="py-24 md:py-36 bg-sand/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-charcoal border-r-transparent"></div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="relative py-24 md:py-36 overflow-hidden">
      {background?.media_url && (
        <>
          {background.media_type === 'video' ? (
            <video
              src={background.media_url}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              loading="lazy"
            />
          ) : (
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed"
              style={{ backgroundImage: `url(${background.media_url})` }}
            />
          )}
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: background.overlay_opacity }}
          />
        </>
      )}
      {!background?.media_url && <div className="absolute inset-0 bg-sand/30" />}

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon_name] || Camera;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center flex flex-col items-center group"
              >
                <div className="mb-6 p-4 rounded-full border border-white/20 group-hover:border-maroon/50 transition-colors duration-300 bg-white/5 backdrop-blur-sm">
                  <Icon strokeWidth={1} size={32} className="text-white group-hover:text-maroon transition-colors duration-300" />
                </div>
                <h3 className="font-serif italic text-2xl text-white mb-4">{service.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-white/80 max-w-xs mx-auto">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;