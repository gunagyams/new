import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Images, FileText, Search, LogOut, ImageIcon, Sparkles, Quote } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/images', label: 'Images', icon: ImageIcon },
    { path: '/admin/projects', label: 'Projects', icon: Images },
    { path: '/admin/blog', label: 'Blog', icon: FileText },
    { path: '/admin/services', label: 'Services', icon: Sparkles },
    { path: '/admin/testimonials', label: 'Reviews', icon: Quote },
    { path: '/admin/seo', label: 'Page SEO', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <nav className="bg-white border-b border-neutral-200">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/admin" className="text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Admin Panel
              </Link>
              <div className="flex items-center gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                target="_blank"
                className="text-sm text-neutral-600 hover:text-neutral-800"
              >
                View Site
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="p-8">
        {children}
      </main>
    </div>
  );
}
