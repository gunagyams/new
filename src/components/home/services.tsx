import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Film, Heart, Sparkles, Award, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  display_order: number;
  published: boolean;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('published', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
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
    <section id="services" className="py-24 md:py-36 bg-sand/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon_name] || Camera;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center flex flex-col items-center group"
              >
                {service.media_url ? (
                  <div className="mb-6 w-full aspect-video overflow-hidden rounded-lg">
                    {service.media_type === 'video' ? (
                      <video
                        src={service.media_url}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={service.media_url}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                ) : (
                  <div className="mb-6 p-4 rounded-full border border-charcoal/10 group-hover:border-maroon/50 transition-colors duration-500">
                    <Icon strokeWidth={1} size={32} className="text-charcoal group-hover:text-maroon transition-colors duration-500" />
                  </div>
                )}
                <h3 className="font-serif italic text-2xl text-charcoal mb-4">{service.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-charcoal/70 max-w-xs mx-auto">
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