import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { supabase } from '../lib/supabase';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/stories' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const location = useLocation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    loadLogo();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const loadLogo = async () => {
    try {
      const { data } = await supabase
        .from('about_page_images')
        .select('image_url')
        .eq('image_key', 'site_logo')
        .maybeSingle();

      if (data?.image_url) {
        setLogoUrl(data.image_url);
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-6 md:px-12 py-4 ${
        isScrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm py-3' : 'bg-cream/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="z-50 relative flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="Site Logo" className="h-12 md:h-14 w-auto" />
          ) : (
            <div className="flex items-center gap-3">
              <Camera className="h-9 w-9 text-maroon" />
              <span className="text-2xl font-serif text-charcoal">SF</span>
            </div>
          )}
        </Link>

        <div className="hidden md:flex space-x-12">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`font-sans text-[15px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                isActive(link.href)
                  ? 'text-maroon font-semibold'
                  : 'text-charcoal hover:text-maroon'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden z-50 text-charcoal"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={36} /> : <Menu size={36} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden overflow-hidden bg-cream border-t border-charcoal/10"
        >
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-4 font-sans text-xl uppercase tracking-[0.15em] transition-colors ${
                  isActive(link.href)
                    ? 'text-maroon font-semibold'
                    : 'text-charcoal hover:text-maroon'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
