import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useBlogs } from '../hooks/useBlogs';

export function Blogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const { blogs, loading, error, fetchBlogs } = useBlogs();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Use only published blogs
  const publishedBlogs = blogs.filter(b => b.status === 'published');

  const filteredBlogs = publishedBlogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getExcerpt = (jsonStr: string) => {
    try {
      // Find the first paragraph node
      const content = JSON.parse(jsonStr);
      if (content?.content) {
        for (const node of content.content) {
          if (node.type === 'paragraph' && node.content && node.content[0]?.text) {
            return node.content[0].text.substring(0, 150) + '...';
          }
        }
      }
      return 'Read more...';
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Technical <span className="text-black dark:text-gray-400">Writings</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Thoughts, tutorials, and insights on web development and software engineering.
          </p>
        </div>

        {/* Appwrite error notice */}
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Search */}
        <div className="flex gap-6 mb-12">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search articles, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:text-gray-500 focus:outline-none focus:border-black dark:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
            />
          </div>
        </div>

        {/* Blog List */}
        <div className="grid grid-cols-1 gap-8">
          {loading ? (
            <div className="flex flex-col gap-6 p-6 rounded-2xl bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
            </div>
          ) : filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <motion.article
                key={blog.$id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.01 }}
                className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {blog.featured_image && (
                  <div className="md:w-64 h-48 md:h-auto overflow-hidden rounded-xl shrink-0">
                    <img src={blog.featured_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-black dark:group-hover:text-gray-300 transition-colors">
                    <Link to={`/blogs/${blog.slug}`}>
                      <span className="absolute inset-0"></span>
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed relative z-10">
                    {getExcerpt(blog.content_json)}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-gray-500 dark:text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(blog.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{blog.read_time} min read</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-4 h-4" />
                      {blog.tags.map(tag => (
                        <span key={tag} className="hover:text-black dark:hover:text-white transition-colors z-10 relative">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center w-12 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                  <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform" />
                </div>
              </motion.article>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200 dark:bg-gray-900/50 dark:border-gray-800">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No articles found matching your query.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-black dark:text-white hover:underline font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
