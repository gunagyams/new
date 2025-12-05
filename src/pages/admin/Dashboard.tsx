import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import { Images, FileText, Plus, Lock, Unlock } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    lockedProjects: 0,
    totalBlogPosts: 0,
    publishedBlogPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, blogPostsRes] = await Promise.all([
        supabase.from('projects').select('id, published, is_locked'),
        supabase.from('blog_posts').select('id, published'),
      ]);

      const projects = projectsRes.data || [];
      const blogPosts = blogPostsRes.data || [];

      setStats({
        totalProjects: projects.length,
        publishedProjects: projects.filter((p) => p.published).length,
        lockedProjects: projects.filter((p) => p.is_locked).length,
        totalBlogPosts: blogPosts.length,
        publishedBlogPosts: blogPosts.filter((p) => p.published).length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: Images,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Published Projects',
      value: stats.publishedProjects,
      icon: Unlock,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Locked Galleries',
      value: stats.lockedProjects,
      icon: Lock,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      title: 'Total Blog Posts',
      value: stats.totalBlogPosts,
      icon: FileText,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Published Posts',
      value: stats.publishedBlogPosts,
      icon: FileText,
      color: 'bg-teal-50 text-teal-600',
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-maroon border-r-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Dashboard
          </h1>
          <p className="text-neutral-600">Welcome to your admin panel</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{card.value}</div>
                <div className="text-sm text-neutral-600">{card.title}</div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/admin/projects/new"
                className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="p-2 bg-maroon text-white rounded">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">New Project</div>
                  <div className="text-sm text-neutral-600">Add a new project to your portfolio</div>
                </div>
              </Link>
              <Link
                to="/admin/blog/new"
                className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="p-2 bg-maroon text-white rounded">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">New Blog Post</div>
                  <div className="text-sm text-neutral-600">Write and publish a new post</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Getting Started
            </h2>
            <div className="space-y-3 text-sm text-neutral-600">
              <p>Welcome to your admin panel! Here you can:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-neutral-800">•</span>
                  <span>Manage project listings with external gallery links</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-800">•</span>
                  <span>Create and edit blog posts with rich text formatting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-800">•</span>
                  <span>Set access codes for locked galleries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-800">•</span>
                  <span>Publish or unpublish content instantly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
