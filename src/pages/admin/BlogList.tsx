import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BlogPost } from '../../lib/types';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

const CATEGORIES = [
  'Wedding Tips',
  'Real Weddings',
  'Photography Tips',
  'Trends',
  'Behind the Scenes',
];

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !post.published })
        .eq('id', post.id);

      if (error) throw error;
      setPosts(
        posts.map((p) =>
          p.id === post.id ? { ...p, published: !p.published } : p
        )
      );
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === 'published') return post.published;
    if (filter === 'draft') return !post.published;
    return true;
  });

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Blog Posts
            </h1>
            <p className="text-neutral-600">{filteredPosts.length} total posts</p>
          </div>
          <Link
            to="/admin/blog/new"
            className="flex items-center gap-2 bg-maroon text-white px-6 py-3 rounded-lg hover:bg-maroon-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Post
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex gap-2 p-4 border-b border-neutral-200">
            {['all', 'published', 'draft'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                  filter === f
                    ? 'bg-maroon text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-neutral-600 mb-4">No blog posts found</p>
            <Link
              to="/admin/blog/new"
              className="inline-flex items-center gap-2 text-neutral-800 hover:underline"
            >
              <Plus className="w-4 h-4" />
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="divide-y divide-neutral-200">
              {filteredPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex gap-6">
                    <div className="w-32 h-24 flex-shrink-0 bg-neutral-200 rounded-lg overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {post.title}
                          </h3>
                          <p className="text-sm text-neutral-600 line-clamp-2">{post.excerpt}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {post.published ? (
                            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              <Eye className="w-3 h-3" />
                              Published
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                              <EyeOff className="w-3 h-3" />
                              Draft
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mb-4">
                        <span className="bg-neutral-100 px-2 py-1 rounded">{post.category}</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        <span className="text-neutral-400">•</span>
                        <span>/blog/{post.slug}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/blog/${post.id}`}
                          className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => togglePublished(post)}
                          className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors text-sm"
                        >
                          {post.published ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              Publish
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
