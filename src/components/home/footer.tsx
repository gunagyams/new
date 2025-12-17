import React from 'react';
import { Instagram, Mail } from 'lucide-react';

const TikTokIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal text-cream py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-between space-y-8">
        <h2 className="font-serif italic text-3xl">SYNCING FILMS</h2>

        <div className="flex space-x-8">
          <a href="https://www.instagram.com/syncingfilms/" target="_blank" rel="noopener noreferrer" className="hover:text-maroon transition-colors"><Instagram size={20} strokeWidth={1.5} /></a>
          <a href="#" className="hover:text-maroon transition-colors"><TikTokIcon size={20} /></a>
          <a href="mailto:syncingfilms@gmail.com" className="hover:text-maroon transition-colors"><Mail size={20} strokeWidth={1.5} /></a>
        </div>

        <div className="text-center md:flex md:space-x-8 font-sans text-[10px] uppercase tracking-widest text-cream/50">
          <span>© {new Date().getFullYear()} Syncing Films</span>
          <span className="hidden md:inline">|</span>
          <span>British Columbia, CA</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;