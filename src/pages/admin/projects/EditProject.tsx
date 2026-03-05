import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjects } from '../../../hooks/useProjects';
import { Editor } from '../../../components/editor/Editor';
import { useStorage } from '../../../hooks/useStorage';
import { Save, ArrowLeft, Loader2, Image as ImageIcon, Github, Globe } from 'lucide-react';

export function EditProject() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getProjectById, createProject, updateProject } = useProjects();
    const { uploadFile } = useStorage();

    const isNew = id === 'new';
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [contentJson, setContentJson] = useState('{}');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [technologies, setTechnologies] = useState('');
    const [repositoryUrl, setRepositoryUrl] = useState('');
    const [liveUrl, setLiveUrl] = useState('');
    const [featuredImage, setFeaturedImage] = useState<string | null>(null);

    useEffect(() => {
        if (isNew) return;

        const load = async () => {
            try {
                const project = await getProjectById(id!);
                setTitle(project.title);
                setSlug(project.slug);
                setDescription(project.description || '');
                setContentJson(project.content_json);
                setStatus(project.status);
                setTechnologies(project.technologies.join(', '));
                setRepositoryUrl(project.repository_url || '');
                setLiveUrl(project.live_url || '');
                setFeaturedImage(project.featured_image);
            } catch {
                setError('Failed to load project');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, isNew, getProjectById]);

    // Auto-generate slug from title
    useEffect(() => {
        if (isNew && title && !slug) {
            setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        }
    }, [title, slug, isNew]);

    const handleEditorChange = (json: any, _html: string) => {
        setContentJson(JSON.stringify(json));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = await uploadFile(file);
        if (url) setFeaturedImage(url);
    };

    const handleSave = async () => {
        if (!title || !slug) {
            setError('Title and slug are required');
            return;
        }

        setSaving(true);
        setError(null);

        const techArray = technologies.split(',').map(t => t.trim()).filter(Boolean);

        const data = {
            title,
            slug,
            description,
            content_json: contentJson,
            status,
            technologies: techArray,
            repository_url: repositoryUrl || null,
            live_url: liveUrl || null,
            featured_image: featuredImage,
            created_by: 'owner',
        };

        try {
            if (isNew) {
                await createProject(data);
            } else {
                await updateProject(id!, data);
            }
            navigate('/admin/projects');
        } catch (err: any) {
            setError(err.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] lg:h-[calc(100vh-4rem)]">
            {/* Header Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        title="Back to Projects"
                        onClick={() => navigate('/admin/projects')}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="font-semibold text-gray-900 dark:text-white">
                        {isNew ? 'New Project' : 'Edit Project'}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {error && <span className="text-sm text-red-500 hidden sm:block">{error}</span>}
                    <select
                        title="Project Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg p-2 transition-colors focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                    <button
                        title="Save Project"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span className="hidden sm:inline">Save</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50 dark:bg-gray-950">
                <div className="max-w-4xl mx-auto space-y-6 pb-20">

                    {/* Core Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="My Awesome Project"
                                    className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-shadow text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-lg">
                                        /projects/
                                    </span>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="my-awesome-project"
                                        className="flex-1 px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-r-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-shadow text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    placeholder="A brief overview of the project shown on listing cards..."
                                    className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-shadow text-gray-900 dark:text-white resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Technologies (comma separated)</label>
                                <input
                                    type="text"
                                    value={technologies}
                                    onChange={(e) => setTechnologies(e.target.value)}
                                    placeholder="React, TypeScript, Appwrite"
                                    className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-shadow text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Links */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    <span className="flex items-center gap-1.5"><Github className="w-3.5 h-3.5" /> Repository URL</span>
                                </label>
                                <input
                                    type="url"
                                    value={repositoryUrl}
                                    onChange={(e) => setRepositoryUrl(e.target.value)}
                                    placeholder="https://github.com/..."
                                    className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-shadow text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Live Demo URL</span>
                                </label>
                                <input
                                    type="url"
                                    value={liveUrl}
                                    onChange={(e) => setLiveUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-shadow text-gray-900 dark:text-white"
                                />
                            </div>
                            {/* Cover Image */}
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image</label>
                                <div className="relative flex-1 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors group overflow-hidden bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center min-h-[120px]">
                                    {featuredImage ? (
                                        <>
                                            <img src={featuredImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">Change Image</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-4">
                                            <ImageIcon className="mx-auto h-7 w-7 text-gray-400 mb-1" />
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Click or drag image</p>
                                        </div>
                                    )}
                                    <input
                                        title="Upload Cover Image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TipTap Editor */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white px-1">Case Study / Documentation</h3>
                        <Editor
                            initialContent={contentJson !== '{}' ? JSON.parse(contentJson) : null}
                            onChange={handleEditorChange}
                            onImageUpload={uploadFile}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
