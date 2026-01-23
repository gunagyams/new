import { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { Project } from '../lib/types';

interface PasswordModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (url: string) => void;
}

export default function PasswordModal({ project, isOpen, onClose, onSuccess }: PasswordModalProps) {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (accessCode.toLowerCase() === project.access_code?.toLowerCase()) {
      if (project.gallery_url) {
        onSuccess(project.gallery_url);
      }
      setAccessCode('');
    } else {
      setError('Invalid access code. Please try again or contact us for assistance.');
    }
  };

  const handleClose = () => {
    setAccessCode('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-12 relative">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-neutral-100 flex items-center justify-center">
            <Lock className="w-8 h-8 text-neutral-600" />
          </div>
        </div>
        <h3 className="text-xs tracking-[0.3em] uppercase text-neutral-500 text-center mb-3">
          Private Gallery
        </h3>
        <p className="text-2xl text-center mb-6 text-neutral-800" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
          {project.client_names || project.title}
        </p>
        <p className="text-sm text-neutral-500 text-center mb-8 leading-relaxed">
          This gallery is password protected. Please enter your access code to view the photos.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e.target.value);
                setError('');
              }}
              required
              className="w-full px-4 py-4 border border-neutral-300 text-sm focus:border-maroon focus:outline-none uppercase tracking-wider text-center"
              placeholder="ENTER ACCESS CODE"
            />
            {error && (
              <p className="text-red-600 text-xs mt-2 text-center">{error}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-maroon hover:bg-maroon-dark text-white py-4 text-xs tracking-[0.2em] uppercase transition-colors"
          >
            View Gallery
          </button>
        </form>
        <p className="text-xs text-neutral-500 text-center mt-6">
          Need help? <a href="/contact" className="text-maroon hover:underline">Contact us</a>
        </p>
      </div>
    </div>
  );
}
