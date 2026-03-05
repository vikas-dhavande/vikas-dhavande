import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Github, Globe, Calendar, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useBlogs } from '../hooks/useBlogs';
import { useProjects } from '../hooks/useProjects';
import { Query } from '../lib/appwrite';

export function Home() {
  const { blogs, fetchBlogs } = useBlogs();
  const { projects, fetchProjects } = useProjects();

  useEffect(() => {
    fetchBlogs([Query.equal('status', 'published'), Query.orderDesc('$createdAt'), Query.limit(3)]);
    fetchProjects([Query.equal('status', 'published'), Query.orderDesc('$createdAt'), Query.limit(3)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const latestBlogs = blogs.filter(b => b.status === 'published').slice(0, 3);
  const featuredProjects = projects.filter(p => p.status === 'published').slice(0, 3);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="container mx-auto px-4 md:px-6">

      {/* ─── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 flex flex-col items-start justify-center min-h-[85vh]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-sm font-medium text-gray-700 dark:text-gray-300 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Available for new opportunities
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-5 leading-[1.05]">
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Vikas Dhavande
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl leading-relaxed">
            Software engineer who builds reliable things and writes about the process.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to="/projects"
              className="group px-7 py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              View Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/blogs"
              className="px-7 py-3.5 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              Read Blogs
            </Link>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Resume
            </a>
          </div>
        </motion.div>
      </section>

      {/* ─── About ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-gray-100 dark:border-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="font-mono text-gray-400 dark:text-gray-600 text-xl mr-3">01.</span>
              About Me
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                I'm a software engineer with a passion for building reliable, well-documented systems. My experience spans
                full-stack development, embedded systems, and industrial automation.
              </p>
              <p>
                I believe that good engineering and good writing go hand in hand — which is why this site combines my
                portfolio with a technical blog where I share what I learn.
              </p>
              <p>
                Currently focused on expanding into modern web architectures and developer tooling.
              </p>
            </div>
          </motion.div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Projects Built', value: '20+' },
              { label: 'Blog Articles', value: '15+' },
              { label: 'Years Experience', value: '6+' },
              { label: 'Open Source Stars', value: '100+' },
            ].map(({ label, value }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
              >
                <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Projects ─────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-gray-100 dark:border-gray-900">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            <span className="font-mono text-gray-400 dark:text-gray-600 text-xl mr-3">02.</span>
            Featured Projects
          </h2>
          <Link to="/projects" className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group">
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featuredProjects.length === 0 ? (
          // Placeholders while empty
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 text-sm">
                Project {i} coming soon
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, i) => (
              <motion.div
                key={project.$id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={`/projects/${project.slug}`}
                  className="group flex flex-col h-full p-6 rounded-2xl bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white/30 shadow-sm hover:shadow-md transition-all"
                >
                  {project.featured_image && (
                    <div className="h-32 rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-900">
                      <img src={project.featured_image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-black dark:group-hover:text-gray-200 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {(project.technologies || []).slice(0, 3).map(t => (
                      <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">{t}</span>
                    ))}
                  </div>
                  {(project.repository_url || project.live_url) && (
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-900">
                      {project.repository_url && (
                        <a href={project.repository_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ─── Latest Blogs ──────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-gray-100 dark:border-gray-900">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            <span className="font-mono text-gray-400 dark:text-gray-600 text-xl mr-3">03.</span>
            Latest Writings
          </h2>
          <Link to="/blogs" className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group">
            Read all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {latestBlogs.length === 0 ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 text-sm">
                Blog post {i} coming soon
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {latestBlogs.map((blog, i) => (
              <motion.div
                key={blog.$id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={`/blogs/${blog.slug}`}
                  className="group p-5 rounded-2xl bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white/30 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-black dark:group-hover:text-gray-200 transition-colors truncate">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(blog.created_at)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{blog.read_time} min read</span>
                      {blog.tags?.[0] && <span className="text-gray-400">#{blog.tags[0]}</span>}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white -rotate-45 group-hover:rotate-0 transition-all shrink-0 hidden sm:block" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
