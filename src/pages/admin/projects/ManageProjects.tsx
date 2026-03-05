import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../../hooks/useProjects';
import {
    Plus, Edit2, Trash2, ExternalLink, Loader2, Github, Globe
} from 'lucide-react';

export function ManageProjects() {
    const navigate = useNavigate();
    const { projects, loading, error, fetchProjects, deleteProject } = useProjects();
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return;
        setDeleting(id);
        await deleteProject(id);
        setDeleting(null);
    };

    const statusBadge = (status: string) =>
        status === 'published'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage your portfolio projects and case studies.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/admin/projects/new')}
                    className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Project
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Table */}
            {loading && projects.length === 0 ? (
                <div className="flex h-60 items-center justify-center">
                    <Loader2 className="w-7 h-7 animate-spin text-gray-400" />
                </div>
            ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No projects yet.</p>
                    <button
                        onClick={() => navigate('/admin/projects/new')}
                        className="flex items-center gap-2 text-sm text-black dark:text-white font-medium hover:underline"
                    >
                        <Plus className="w-4 h-4" /> Create your first project
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-5 py-3">Project</th>
                                <th className="px-5 py-3 hidden md:table-cell">Technologies</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3 hidden sm:table-cell">Links</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {projects.map((project) => (
                                <tr
                                    key={project.$id}
                                    className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                >
                                    <td className="px-5 py-4">
                                        <div className="font-medium text-gray-900 dark:text-white">{project.title}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[200px]">
                                            /projects/{project.slug}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {(project.technologies || []).slice(0, 3).map((tech) => (
                                                <span key={tech} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                                                    {tech}
                                                </span>
                                            ))}
                                            {(project.technologies || []).length > 3 && (
                                                <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                                                    +{project.technologies.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge(project.status)}`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 hidden sm:table-cell">
                                        <div className="flex items-center gap-3">
                                            {project.repository_url && (
                                                <a href={project.repository_url} target="_blank" rel="noreferrer" title="Repository" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            )}
                                            {project.live_url && (
                                                <a href={project.live_url} target="_blank" rel="noreferrer" title="Live Demo" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                                    <Globe className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={`/projects/${project.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                title="View Public Page"
                                                className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <button
                                                title="Edit Project"
                                                onClick={() => navigate(`/admin/projects/${project.$id}`)}
                                                className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                title="Delete Project"
                                                onClick={() => handleDelete(project.$id, project.title)}
                                                disabled={deleting === project.$id}
                                                className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                            >
                                                {deleting === project.$id
                                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                                    : <Trash2 className="w-4 h-4" />
                                                }
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
