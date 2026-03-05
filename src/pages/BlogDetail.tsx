import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogs, BlogItem } from '../hooks/useBlogs';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Calendar, Clock, Tag, Loader2, Heart, MessageSquare, Pencil } from 'lucide-react';
import { motion } from 'motion/react';
import { generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import { databases, DB_ID, LIKES_COLLECTION_ID, COMMENTS_COLLECTION_ID, Query, ID } from '../lib/appwrite';

export function BlogDetail() {
    const { slug } = useParams<{ slug: string }>();
    const { getBlogBySlug } = useBlogs();
    const { isLoggedIn, isAdmin, user } = useAuth();
    const [blog, setBlog] = useState<BlogItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Interaction state
    const [likesCount, setLikesCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [likeId, setLikeId] = useState<string | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [commentText, setCommentText] = useState('');
    const [isSubmittingLike, setIsSubmittingLike] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    useEffect(() => {
        const fetchInteractions = async (blogId: string) => {
            if (!DB_ID || !LIKES_COLLECTION_ID || !COMMENTS_COLLECTION_ID) return;

            try {
                // Fetch likes count
                const likesResponse = await databases.listDocuments(DB_ID, LIKES_COLLECTION_ID, [
                    Query.equal('blogId', blogId),
                    Query.limit(1)
                ]);
                setLikesCount(likesResponse.total);

                // Check if current user has liked
                if (user?.$id) {
                    const myLike = await databases.listDocuments(DB_ID, LIKES_COLLECTION_ID, [
                        Query.equal('blogId', blogId),
                        Query.equal('userId', user.$id)
                    ]);
                    if (myLike.total > 0) {
                        setHasLiked(true);
                        setLikeId(myLike.documents[0].$id);
                    }
                }

                // Fetch comments
                const commentsResponse = await databases.listDocuments(DB_ID, COMMENTS_COLLECTION_ID, [
                    Query.equal('blogId', blogId),
                    Query.orderDesc('$createdAt')
                ]);
                setComments(commentsResponse.documents);
            } catch (err) {
                console.error("Error fetching interactions:", err);
            }
        };

        const fetchBlog = async () => {
            try {
                if (!slug) return;
                const data = await getBlogBySlug(slug);
                if (data) {
                    setBlog(data);
                    fetchInteractions(data.$id);
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
    }, [slug, getBlogBySlug, user?.$id]);

    const handleLike = async () => {
        if (!user || !blog || isSubmittingLike || !LIKES_COLLECTION_ID) return;
        setIsSubmittingLike(true);

        try {
            if (hasLiked && likeId) {
                // Unlike
                await databases.deleteDocument(DB_ID, LIKES_COLLECTION_ID, likeId);
                setHasLiked(false);
                setLikeId(null);
                setLikesCount(prev => Math.max(0, prev - 1));
            } else {
                // Like
                const response = await databases.createDocument(
                    DB_ID,
                    LIKES_COLLECTION_ID,
                    ID.unique(),
                    {
                        blogId: blog.$id,
                        userId: user.$id
                    }
                );
                setHasLiked(true);
                setLikeId(response.$id);
                setLikesCount(prev => prev + 1);
            }
        } catch (err) {
            console.error("Like action failed:", err);
        } finally {
            setIsSubmittingLike(false);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !blog || !commentText.trim() || isSubmittingComment || !COMMENTS_COLLECTION_ID) return;
        setIsSubmittingComment(true);

        try {
            const response = await databases.createDocument(
                DB_ID,
                COMMENTS_COLLECTION_ID,
                ID.unique(),
                {
                    blogId: blog.$id,
                    userId: user.$id,
                    userName: user.name,
                    content: commentText.trim()
                }
            );
            setComments(prev => [response, ...prev]);
            setCommentText('');
        } catch (err) {
            console.error("Comment submission failed:", err);
        } finally {
            setIsSubmittingComment(false);
        }
    };

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

                    {/* ── Post Footer: Like & Comment ─────────────────────── */}
                    <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-900">
                        {isLoggedIn ? (
                            <div className="space-y-8">
                                {/* Like button */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleLike}
                                        disabled={isSubmittingLike}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-medium text-sm transition-all duration-200 ${hasLiked
                                            ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200 dark:shadow-rose-900/30'
                                            : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-rose-400 hover:text-rose-500'
                                            } ${isSubmittingLike ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        aria-label={hasLiked ? 'Unlike this post' : 'Like this post'}
                                    >
                                        {isSubmittingLike ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Heart className={`w-4 h-4 transition-transform ${hasLiked ? 'scale-110 fill-current' : ''}`} />
                                        )}
                                        {hasLiked ? 'Liked' : 'Like this post'}
                                    </button>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {likesCount === 0
                                            ? 'Be the first to like this'
                                            : `${likesCount} ${likesCount === 1 ? 'person' : 'people'} liked this`}
                                    </span>
                                </div>

                                {/* Comment section */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5" />
                                        Comments ({comments.length})
                                    </h3>

                                    {/* New Comment input */}
                                    <form onSubmit={handleComment} className="mb-8 group">
                                        <div className="relative">
                                            <textarea
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                placeholder="Write a comment..."
                                                className="w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none min-h-[120px]"
                                                rows={3}
                                            />
                                            <div className="absolute bottom-3 right-3">
                                                <button
                                                    type="submit"
                                                    disabled={!commentText.trim() || isSubmittingComment}
                                                    className="px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all"
                                                >
                                                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>

                                    {/* Comments list */}
                                    <div className="space-y-6">
                                        {comments.length === 0 ? (
                                            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-8 bg-gray-50 dark:bg-gray-900/50 text-center text-sm text-gray-500 dark:text-gray-400 italic">
                                                No comments yet. Be the first to share your thoughts!
                                            </div>
                                        ) : (
                                            comments.map((comment) => (
                                                <div key={comment.$id} className="flex gap-4 group">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center font-bold text-gray-400 text-xs shrink-0 border border-gray-200 dark:border-gray-800">
                                                        {comment.userName?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <div className="flex-1 space-y-1.5 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                                {comment.userName}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 px-1.5 py-0.5 rounded-md bg-gray-50 dark:bg-gray-800/50">
                                                                {new Date(comment.$createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed break-words">
                                                            {comment.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* CTA for non-logged-in visitors */
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 px-6 py-5">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Enjoying this post?</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Log in to like and leave a comment.</p>
                                </div>
                                <Link
                                    to="/login"
                                    className="shrink-0 inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                >
                                    Log in
                                </Link>
                            </div>
                        )}

                        {/* Admin shortcut: edit this post */}
                        {isAdmin && blog && (
                            <div className="mt-6 flex justify-end">
                                <Link
                                    to={`/admin/blogs/${blog.$id}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                    Edit post (Admin)
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </article>
    );
}
