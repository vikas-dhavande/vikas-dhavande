import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Github, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';

function ProjectSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
      <div className="h-48 sm:h-56 bg-gray-200 dark:bg-gray-800" />
      <div className="p-6 space-y-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
      </div>
    </div>
  );
}

export function Projects() {
  const { projects, loading, error, fetchProjects } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const published = projects.filter(p => p.status === 'published');

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Engineering <span className="text-gray-500 dark:text-gray-400">Projects</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            A curated showcase of software and hardware projects, case studies, and technical explorations.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProjectSkeleton />
            <ProjectSkeleton />
            <ProjectSkeleton />
            <ProjectSkeleton />
          </div>
        ) : published.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
            <Loader2 className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No projects published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {published.map((project, index) => (
              <motion.div
                key={project.$id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="group flex flex-col rounded-2xl bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-black dark:hover:border-white/30 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Image Header */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100 dark:bg-gray-900">
                  {project.featured_image ? (
                    <img
                      src={project.featured_image}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-700">
                      <span className="text-4xl font-bold opacity-20">{project.title[0]}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Quick links over image */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    {project.repository_url && (
                      <a
                        href={project.repository_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        aria-label="GitHub Repository"
                        className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        aria-label="Live Demo"
                        className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-black dark:group-hover:text-gray-200 transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed flex-1 text-sm">
                    {project.description || 'Read the full case study for details.'}
                  </p>

                  {/* Tech badges */}
                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.technologies.map(tech => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-5 border-t border-gray-100 dark:border-gray-900 mt-auto">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-black dark:text-white hover:opacity-70 transition-opacity"
                    >
                      View Case Study →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
