import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogs, BlogItem } from '../hooks/useBlogs';
import { ArrowLeft, Calendar, Clock, Tag, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';

export function BlogDetail() {
    const { slug } = useParams<{ slug: string }>();
    const { getBlogBySlug } = useBlogs();
    const [blog, setBlog] = useState<BlogItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                if (!slug) return;
                const data = await getBlogBySlug(slug);
                if (data) {
                    setBlog(data);
                } else {
                    setError('Blog not found');
                }
            } catch (err) {
                setError('Failed to load blog post');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug, getBlogBySlug]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getHtmlContent = (jsonStr: string) => {
        try {
            const json = JSON.parse(jsonStr);
            // Need to mirror the extensions used in the editor
            return generateHTML(json, [
                StarterKit,
                Image.configure({
                    HTMLAttributes: {
                        class: 'rounded-xl max-w-full h-auto object-cover my-8 shadow-sm border border-gray-200 dark:border-gray-800'
                    }
                }),
                LinkExtension.configure({
                    HTMLAttributes: {
                        class: 'text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                    }
                })
            ]);
        } catch (e) {
            return '<p>Content rendering failed.</p>';
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-gray-400 mb-4" />
                <p className="text-gray-500">Loading post...</p>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">{error || 'Blog not found'}</h1>
                <Link to="/blogs" className="text-blue-500 hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to all blogs
                </Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen py-12 md:py-20 lg:py-24 bg-white dark:bg-black transition-colors">
            <div className="max-w-[720px] mx-auto px-4 md:px-0">
                <Link
                    to="/blogs"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-10 md:mb-12 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to writings
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header / Meta */}
                    <div className="space-y-6 mb-12">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-[1.15] tracking-tight">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-gray-500 dark:text-gray-400 pb-8 border-b border-gray-100 dark:border-gray-900">
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
                                {blog.tags.map((tag: string) => (
                                    <span key={tag} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {blog.featured_image && (
                        <div className="mb-12 rounded-2xl overflow-hidden aspect-[21/9] border border-gray-200 dark:border-gray-800">
                            <img
                                src={blog.featured_image}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Rich Text Content */}
                    <div className="prose prose-lg dark:prose-invert max-w-none
                            prose-headings:font-bold prose-headings:tracking-tight
                            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-xl prose-img:border prose-img:border-gray-200 dark:prose-img:border-gray-800
                            prose-code:before:content-none prose-code:after:content-none prose-code:bg-gray-100 dark:prose-code:bg-gray-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                            prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:text-gray-900 dark:prose-pre:text-gray-100 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-800"
                        dangerouslySetInnerHTML={{ __html: getHtmlContent(blog.content_json) }}
                    />
                </motion.div>
            </div>
        </article>
    );
}
