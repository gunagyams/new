import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../lib/types';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] pt-24 flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-maroon border-r-transparent"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#f8f6f3] pt-24">
      <div className="relative h-[300px] bg-gradient-to-br from-[#d4c5b0] via-[#c9b89a] to-[#b8a585]">
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl tracking-[0.3em] uppercase text-neutral-800 mb-6 font-bold">Journal</h1>
            <p className="text-neutral-700 max-w-xl text-lg">
              Stories, tips, and inspiration for your wedding day
            </p>
          </div>
        </div>
      </div>

      <section className="py-32 px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-600">No blog posts available at this time.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group"
                >
                  <article>
                    <div className="relative overflow-hidden aspect-[4/5] mb-6">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4 tracking-wider">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <h3 className="text-2xl mb-3 text-neutral-800 group-hover:text-neutral-600 transition-colors leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                        {post.title}
                      </h3>
                      <p className="text-neutral-600 mb-4 leading-relaxed text-sm">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-maroon group-hover:gap-3 transition-all">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
