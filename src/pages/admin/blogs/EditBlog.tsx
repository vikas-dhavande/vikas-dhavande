import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlogs } from '../../../hooks/useBlogs';
import { Editor } from '../../../components/editor/Editor';
import { useStorage } from '../../../hooks/useStorage';
import { Save, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';

export function EditBlog() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getBlogById, createBlog, updateBlog } = useBlogs();
    const { uploadFile } = useStorage();

    const isNew = id === 'new';
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [contentJson, setContentJson] = useState('{}');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [tags, setTags] = useState('');
    const [featuredImage, setFeaturedImage] = useState<string | null>(null);

    useEffect(() => {
        if (isNew) return;

        const loadBlog = async () => {
            try {
                const blog = await getBlogById(id!);
                setTitle(blog.title);
                setSlug(blog.slug);
                setContentJson(blog.content_json);
                setStatus(blog.status);
                setTags(blog.tags.join(', '));
                setFeaturedImage(blog.featured_image);
            } catch (err) {
                setError('Failed to load blog post');
            } finally {
                setLoading(false);
            }
        };

        loadBlog();
    }, [id, isNew, getBlogById]);

    // Auto-generate slug from title if empty
    useEffect(() => {
        if (isNew && title && !slug) {
            setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        }
    }, [title, slug, isNew]);

    const handleEditorChange = (json: any, html: string) => {
        setContentJson(JSON.stringify(json));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = await uploadFile(file);
        if (url) {
            setFeaturedImage(url);
        }
    };

    const calculateReadTime = (jsonStr: string) => {
        try {
            // rough estimation: parse json, extract text, divide by 200 words/min
            const text = JSON.stringify(JSON.parse(jsonStr)).replace(/<[^>]*>/g, '');
            const words = text.split(/\s+/).length;
            return Math.max(1, Math.ceil(words / 200));
        } catch (e) {
            return 1;
        }
    }

    const handleSave = async () => {
        if (!title || !slug) {
            setError('Title and Slug are required');
            return;
        }

        setSaving(true);
        setError(null);

        const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);

        // Create a robust ISO string
        const now = new Date().toISOString();

        const blogData = {
            title,
            slug,
            content_json: contentJson,
            status,
            tags: tagArray,
            read_time: calculateReadTime(contentJson), // Calculate read time based on length
            featured_image: featuredImage,
            author_id: 'auto', // In a real app, tie this to user session, we can map to Appwrite Auth ID if needed
            created_at: now
        };

        try {
            if (isNew) {
                await createBlog(blogData);
                navigate('/admin/blogs');
            } else {
                await updateBlog(id!, blogData);
                navigate('/admin/blogs');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to save blog');
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
                        title="Back to Manage Blogs"
                        onClick={() => navigate('/admin/blogs')}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                        {isNew ? 'New Post' : 'Edit Post'}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {error && <span className="text-sm text-red-500 hidden sm:inline-block">{error}</span>}
                    <select
                        title="Post Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white block p-2 transition-colors"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                    <button
                        title="Save Post"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span className="hidden sm:inline">Save</span>
                    </button>
                </div>
            </div>

            {/* Editor Content Area */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50 dark:bg-gray-950">
                <div className="max-w-4xl mx-auto space-y-6 pb-20">

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="The Greatest Post Ever Written"
                                    className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-shadow text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Slug
                                </label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-lg">
                                        /blogs/
                                    </span>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="my-great-post"
                                        className="flex-1 px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-r-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-shadow text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="react, webdev, tutorial"
                                    className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-shadow text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Cover Image Upload */}
                        <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Cover Image
                            </label>
                            <div className="flex-1 relative rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors group overflow-hidden bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center min-h-[150px]">
                                {featuredImage ? (
                                    <>
                                        <img src={featuredImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white font-medium text-sm">Change Image</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Click or drag image to upload</p>
                                    </div>
                                )}
                                <input
                                    title="Upload cover image file"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* TipTap Editor */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white px-1">Content</h3>
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
