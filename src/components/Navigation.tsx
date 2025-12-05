import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

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
  const location = useLocation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-6 md:px-12 py-6 ${
        isScrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm py-4' : 'bg-cream/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="z-50 relative">
          <img src="/assets/images/sf_logo.png" alt="SF Logo" className="h-12 md:h-14 w-auto" />
        </Link>

        <div className="hidden md:flex space-x-12">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`font-sans text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
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
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 font-sans text-sm uppercase tracking-[0.15em] transition-colors ${
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
