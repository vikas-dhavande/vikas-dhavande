import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlogs } from '../../../hooks/useBlogs';
import { Editor } from '../../../components/editor/Editor';
import { useStorage } from '../../../hooks/useStorage';
import {
    ArrowLeft, Loader2, Eye, ExternalLink,
    Tag, MapPin, Link as LinkIcon, Calendar, Settings, Image as ImageIcon, ChevronRight, ChevronDown
} from 'lucide-react';

export function EditBlog() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getBlogById, createBlog, updateBlog } = useBlogs();
    const { uploadFile } = useStorage();

    const isNew = id === 'new';
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form States
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [contentJson, setContentJson] = useState('{}');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [tags, setTags] = useState('');
    const [featuredImage, setFeaturedImage] = useState<string | null>(null);
    const [location, setLocation] = useState('');
    const [allowComments, setAllowComments] = useState(true);
    const [publishedAt, setPublishedAt] = useState(''); // ISO string for the datetime-local input

    // Sidebar Accordion States
    const [openSections, setOpenSections] = useState({
        labels: true,
        publishedOn: true,
        permalink: true,
        location: true,
        options: true,
        coverImage: true
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

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
                setLocation(blog.location || '');
                setAllowComments(blog.allow_comments !== false);

                if (blog.created_at) {
                    // Convert to local datetime format for input
                    const date = new Date(blog.created_at);
                    const formatted = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                    setPublishedAt(formatted);
                }
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
            const text = JSON.stringify(JSON.parse(jsonStr)).replace(/<[^>]*>/g, '');
            const words = text.split(/\s+/).length;
            return Math.max(1, Math.ceil(words / 200));
        } catch (e) {
            return 1;
        }
    }

    const handleSaveAndPublish = async (newStatus: 'draft' | 'published') => {
        if (!title || !slug) {
            setError('Title and Link (slug) are required');
            return;
        }

        setSaving(true);
        setError(null);
        setStatus(newStatus);

        const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
        const finalCreatedAt = publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString();

        const blogData = {
            title,
            slug,
            content_json: contentJson,
            status: newStatus,
            tags: tagArray,
            read_time: calculateReadTime(contentJson),
            featured_image: featuredImage,
            author_id: 'auto',
            created_at: finalCreatedAt,
            location: location,
            allow_comments: allowComments
        };

        try {
            if (isNew) {
                await createBlog(blogData);
            } else {
                await updateBlog(id!, blogData);
            }
            navigate('/admin/blogs');
        } catch (err: any) {
            setError(err.message || 'Failed to save blog');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans">

            {/* Top Toolbar Header (Blogger Style) */}
            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/blogs')}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        title="Back to posts"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white text-lg">
                            {isNew ? 'New post' : 'Edit post'}
                        </span>
                        {error && <span className="text-xs text-red-500">{error}</span>}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        className="flex items-center gap-2 px-4 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium text-sm transition-colors"
                        title="Preview"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Preview</span>
                    </button>

                    <button
                        onClick={() => handleSaveAndPublish('draft')}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border-l border-gray-200 dark:border-gray-800 rounded-md font-medium text-sm transition-colors"
                        title="Save as Draft"
                    >
                        {saving && status === 'draft' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Save
                    </button>

                    <button
                        onClick={() => handleSaveAndPublish('published')}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-medium text-sm shadow-sm transition-colors disabled:opacity-50"
                        title="Publish Post"
                    >
                        {saving && status === 'published' ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : null}
                        Publish
                    </button>
                </div>
            </div>

            {/* Main Workspace (Two Columns) */}
            <div className="flex flex-1 overflow-hidden">

                {/* Left Column: Editor Area */}
                <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 shadow-inner">
                    <div className="max-w-[800px] mx-auto min-h-full flex flex-col pt-8 pb-32 px-4 sm:px-8 lg:px-12">

                        {/* Title Input */}
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full text-4xl sm:text-5xl font-bold bg-transparent text-gray-900 dark:text-gray-100 outline-none border-b border-gray-200 dark:border-gray-800 pb-4 mb-4 placeholder-gray-300 dark:placeholder-gray-700 transition-colors"
                        />

                        {/* Tiptap Editor */}
                        <div className="flex-1 w-full text-gray-800 dark:text-gray-300 text-lg leading-relaxed">
                            <Editor
                                initialContent={contentJson !== '{}' ? JSON.parse(contentJson) : null}
                                onChange={handleEditorChange}
                                onImageUpload={uploadFile}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Post Settings Sidebar */}
                <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 overflow-y-auto hidden md:block shrink-0">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wide uppercase">Post Settings</h2>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-gray-800">

                        {/* Labels Section */}
                        <div className="py-2">
                            <button onClick={() => toggleSection('labels')} className="w-full px-4 py-2 flex items-center justify-between text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-2 text-sm font-medium"><Tag className="w-4 h-4 text-gray-500" /> Labels</div>
                                {openSections.labels ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                            </button>
                            {openSections.labels && (
                                <div className="px-4 pb-4 pt-1 space-y-2">
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="Separate labels by commas"
                                        className="w-full text-sm p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 dark:text-white"
                                    />
                                    {tags && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                                                <span key={t} className="text-xs bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Published Date Section */}
                        <div className="py-2">
                            <button onClick={() => toggleSection('publishedOn')} className="w-full px-4 py-2 flex items-center justify-between text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-2 text-sm font-medium"><Calendar className="w-4 h-4 text-gray-500" /> Published on</div>
                                {openSections.publishedOn ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                            </button>
                            {openSections.publishedOn && (
                                <div className="px-4 pb-4 pt-1 space-y-2">
                                    <input
                                        aria-label="Published on date"
                                        type="datetime-local"
                                        value={publishedAt}
                                        onChange={(e) => setPublishedAt(e.target.value)}
                                        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 dark:text-white"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Permalink Section */}
                        <div className="py-2">
                            <button onClick={() => toggleSection('permalink')} className="w-full px-4 py-2 flex items-center justify-between text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-2 text-sm font-medium"><LinkIcon className="w-4 h-4 text-gray-500" /> Permalink</div>
                                {openSections.permalink ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                            </button>
                            {openSections.permalink && (
                                <div className="px-4 pb-4 pt-1 space-y-2">
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="custom-url-slug"
                                        className="w-full text-sm p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 dark:text-white"
                                    />
                                    {slug && (
                                        <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-1">
                                            <ExternalLink className="w-3 h-3 shrink-0" /> /blogs/{slug}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Location Section */}
                        <div className="py-2">
                            <button onClick={() => toggleSection('location')} className="w-full px-4 py-2 flex items-center justify-between text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-2 text-sm font-medium"><MapPin className="w-4 h-4 text-gray-500" /> Location</div>
                                {openSections.location ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                            </button>
                            {openSections.location && (
                                <div className="px-4 pb-4 pt-1">
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Add a location name"
                                        className="w-full text-sm p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 dark:text-white"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Cover Image Section */}
                        <div className="py-2">
                            <button onClick={() => toggleSection('coverImage')} className="w-full px-4 py-2 flex items-center justify-between text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-2 text-sm font-medium"><ImageIcon className="w-4 h-4 text-gray-500" /> Cover Image</div>
                                {openSections.coverImage ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                            </button>
                            {openSections.coverImage && (
                                <div className="px-4 pb-4 pt-1">
                                    <div className="relative rounded border border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center min-h-[120px] cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                        {featuredImage ? (
                                            <img src={featuredImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-3">
                                                <ImageIcon className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Upload Image</p>
                                            </div>
                                        )}
                                        <input
                                            title="Upload cover image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Options Section */}
                        <div className="py-2 border-b border-gray-200 dark:border-gray-800">
                            <button onClick={() => toggleSection('options')} className="w-full px-4 py-2 flex items-center justify-between text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-2 text-sm font-medium"><Settings className="w-4 h-4 text-gray-500" /> Options</div>
                                {openSections.options ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                            </button>
                            {openSections.options && (
                                <div className="px-4 pb-4 pt-1 space-y-3">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-2">Reader comments</label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-300 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    checked={allowComments === true}
                                                    onChange={() => setAllowComments(true)}
                                                    className="text-orange-600 focus:ring-orange-500"
                                                />
                                                Allow
                                            </label>
                                            <label className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-300 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    checked={allowComments === false}
                                                    onChange={() => setAllowComments(false)}
                                                    className="text-orange-600 focus:ring-orange-500"
                                                />
                                                Do not allow
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
