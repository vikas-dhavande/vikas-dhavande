import { useState, useCallback } from 'react';
import { databases, DB_ID, BLOGS_COLLECTION_ID, Query } from '../lib/appwrite';
import { Models } from 'appwrite';

export interface BlogItem extends Models.Document {
    title: string;
    slug: string;
    content_json: string;
    status: 'draft' | 'published';
    tags: string[];
    author_id: string;
    read_time: number;
    featured_image: string | null;
    created_at: string;
}

export function useBlogs() {
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBlogs = useCallback(async (queries: string[] = [Query.orderDesc('$createdAt')]) => {
        setLoading(true);
        setError(null);
        try {
            const response = await databases.listDocuments<BlogItem>(
                DB_ID,
                BLOGS_COLLECTION_ID,
                queries
            );
            setBlogs(response.documents);
            return response.documents;
        } catch (err: any) {
            console.error('Failed to fetch blogs:', err);
            setError(err.message || 'Failed to fetch blogs');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const getBlogBySlug = useCallback(async (slug: string) => {
        try {
            const response = await databases.listDocuments<BlogItem>(
                DB_ID,
                BLOGS_COLLECTION_ID,
                [Query.equal('slug', slug), Query.limit(1)]
            );
            return response.documents[0] || null;
        } catch (err: any) {
            console.error('Failed to fetch blog by slug:', err);
            throw err;
        }
    }, []);

    const getBlogById = useCallback(async (id: string) => {
        try {
            const response = await databases.getDocument<BlogItem>(
                DB_ID,
                BLOGS_COLLECTION_ID,
                id
            );
            return response;
        } catch (err: any) {
            console.error('Failed to fetch blog by id:', err);
            throw err;
        }
    }, []);

    const createBlog = useCallback(async (data: Omit<BlogItem, keyof Models.Document>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await databases.createDocument<BlogItem>(
                DB_ID,
                BLOGS_COLLECTION_ID,
                'unique()',
                data
            );
            setBlogs((prev) => [response, ...prev]);
            return response;
        } catch (err: any) {
            console.error('Failed to create blog:', err);
            setError(err.message || 'Failed to create blog');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateBlog = useCallback(async (id: string, data: Partial<Omit<BlogItem, keyof Models.Document>>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await databases.updateDocument<BlogItem>(
                DB_ID,
                BLOGS_COLLECTION_ID,
                id,
                data
            );
            setBlogs((prev) => prev.map((blog) => (blog.$id === id ? response : blog)));
            return response;
        } catch (err: any) {
            console.error('Failed to update blog:', err);
            setError(err.message || 'Failed to update blog');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteBlog = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await databases.deleteDocument(DB_ID, BLOGS_COLLECTION_ID, id);
            setBlogs((prev) => prev.filter((blog) => blog.$id !== id));
            return true;
        } catch (err: any) {
            console.error('Failed to delete blog:', err);
            setError(err.message || 'Failed to delete blog');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        blogs,
        loading,
        error,
        fetchBlogs,
        getBlogBySlug,
        getBlogById,
        createBlog,
        updateBlog,
        deleteBlog,
    };
}
