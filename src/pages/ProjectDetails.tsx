import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Github, ExternalLink, Loader2 } from 'lucide-react';
import { useProjects, ProjectItem } from '../hooks/useProjects';
import { generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';

export function ProjectDetails() {
  const { id: slug } = useParams<{ id: string }>();
  const { getProjectBySlug } = useProjects();
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!slug) return;
        const data = await getProjectBySlug(slug);
        if (data) {
          setProject(data);
        } else {
          setError('Project not found');
        }
      } catch {
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, getProjectBySlug]);

  const getHtml = (jsonStr: string) => {
    try {
      const json = JSON.parse(jsonStr);
      return generateHTML(json, [
        StarterKit,
        Image.configure({
          HTMLAttributes: { class: 'rounded-xl max-w-full h-auto my-8 shadow-sm border border-gray-200 dark:border-gray-800' }
        }),
        LinkExtension.configure({
          HTMLAttributes: { class: 'text-blue-600 dark:text-blue-400 hover:underline' }
        }),
      ]);
    } catch {
      return '<p>Content rendering failed.</p>';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-gray-400 mb-4" />
        <p className="text-gray-500">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">{error || 'Project Not Found'}</h1>
        <Link to="/projects" className="inline-flex items-center gap-2 text-blue-500 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-10 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>

          {/* Hero Image */}
          {project.featured_image && (
            <div className="w-full h-64 md:h-[28rem] rounded-2xl overflow-hidden mb-10 border border-gray-200 dark:border-gray-800">
              <img
                src={project.featured_image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {project.title}
              </h1>
              {project.description && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                  {project.description}
                </p>
              )}

              {/* Rich text body */}
              {project.content_json && project.content_json !== '{}' && (
                <div
                  className="prose prose-lg dark:prose-invert max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-xl prose-img:border prose-img:border-gray-200 dark:prose-img:border-gray-800
                    prose-code:before:content-none prose-code:after:content-none prose-code:bg-gray-100 dark:prose-code:bg-gray-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                    prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-800"
                  dangerouslySetInnerHTML={{ __html: getHtml(project.content_json) }}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 sticky top-6">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">Project Info</h3>

                {/* Technologies */}
                {project.technologies?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-3">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map(tech => (
                        <span key={tech} className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {(project.repository_url || project.live_url) && (
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-5 space-y-3">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-3">Links</h4>
                    {project.repository_url && (
                      <a
                        href={project.repository_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition-colors"
                      >
                        <Github className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-medium">View Source Code</span>
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-medium">Live Demo</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
