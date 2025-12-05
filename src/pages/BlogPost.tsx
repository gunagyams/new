import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BlogPost as BlogPostType } from '../lib/types';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        navigate('/blog');
        return;
      }

      setPost(data);

      const { data: related } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .eq('category', data.category)
        .neq('id', data.id)
        .limit(3);

      setRelatedPosts(related || []);
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/blog');
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

  if (!post) {
    return null;
  }

  const seoTitle = post.seo_title || post.title;
  const seoDescription = post.seo_description || post.excerpt;
  const ogTitle = post.og_title || seoTitle;
  const ogDescription = post.og_description || seoDescription;
  const ogImage = post.og_image || post.image;
  const twitterTitle = post.twitter_title || ogTitle;
  const twitterDescription = post.twitter_description || ogDescription;
  const canonicalUrl = post.canonical_url || `${window.location.origin}/blog/${post.slug}`;

  return (
    <div className="min-h-screen bg-[#f8f6f3] pt-24">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        {post.seo_keywords && <meta name="keywords" content={post.seo_keywords} />}
        {post.robots_meta && <meta name="robots" content={post.robots_meta} />}
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        {post.published_at && <meta property="article:published_time" content={post.published_at} />}
        {post.updated_at && <meta property="article:modified_time" content={post.updated_at} />}
        {post.category && <meta property="article:section" content={post.category} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={twitterTitle} />
        <meta name="twitter:description" content={twitterDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <div className="relative h-[600px] bg-neutral-900">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex items-end justify-center pb-20 px-4">
          <div className="max-w-3xl w-full text-center">
            <div className="flex items-center justify-center gap-4 text-xs text-white mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <span className="text-neutral-400">•</span>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>{post.category}</span>
              </div>
            </div>
            <h1
              className="text-5xl md:text-6xl text-white leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
            >
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <article className="py-20 px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-maroon mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="text-xl text-neutral-600 mb-12 leading-relaxed italic">
            {post.excerpt}
          </div>

          <div
            className="prose prose-lg prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.8,
            }}
          />
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="py-20 px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-4xl text-center mb-16"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
            >
              Related Posts
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="relative overflow-hidden aspect-[4/5] mb-4">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3
                    className="text-xl mb-2 text-neutral-800 group-hover:text-neutral-600 transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                  >
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-neutral-600">{relatedPost.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
