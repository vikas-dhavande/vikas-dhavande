import { useState, useCallback } from 'react';
import { databases, DB_ID, PROJECTS_COLLECTION_ID, Query } from '../lib/appwrite';
import { Models } from 'appwrite';

export interface ProjectItem extends Models.Document {
    title: string;
    slug: string;
    content_json: string;
    description: string | null;
    repository_url: string | null;
    live_url: string | null;
    technologies: string[];
    featured_image: string | null;
    status: 'draft' | 'published';
    created_by: string;
}

export function useProjects() {
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async (queries: string[] = [Query.orderDesc('$createdAt')]) => {
        setLoading(true);
        setError(null);
        try {
            const response = await databases.listDocuments<ProjectItem>(
                DB_ID,
                PROJECTS_COLLECTION_ID,
                queries
            );
            setProjects(response.documents);
            return response.documents;
        } catch (err: any) {
            console.error('Failed to fetch projects:', err);
            setError(err.message || 'Failed to fetch projects');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const getProjectBySlug = useCallback(async (slug: string) => {
        try {
            const response = await databases.listDocuments<ProjectItem>(
                DB_ID,
                PROJECTS_COLLECTION_ID,
                [Query.equal('slug', slug), Query.limit(1)]
            );
            return response.documents[0] || null;
        } catch (err: any) {
            console.error('Failed to fetch project by slug:', err);
            throw err;
        }
    }, []);

    const getProjectById = useCallback(async (id: string) => {
        try {
            const response = await databases.getDocument<ProjectItem>(
                DB_ID,
                PROJECTS_COLLECTION_ID,
                id
            );
            return response;
        } catch (err: any) {
            console.error('Failed to fetch project by id:', err);
            throw err;
        }
    }, []);

    const createProject = useCallback(async (data: Omit<ProjectItem, keyof Models.Document>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await databases.createDocument<ProjectItem>(
                DB_ID,
                PROJECTS_COLLECTION_ID,
                'unique()',
                data
            );
            setProjects((prev) => [response, ...prev]);
            return response;
        } catch (err: any) {
            console.error('Failed to create project:', err);
            setError(err.message || 'Failed to create project');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProject = useCallback(async (id: string, data: Partial<Omit<ProjectItem, keyof Models.Document>>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await databases.updateDocument<ProjectItem>(
                DB_ID,
                PROJECTS_COLLECTION_ID,
                id,
                data
            );
            setProjects((prev) => prev.map((p) => (p.$id === id ? response : p)));
            return response;
        } catch (err: any) {
            console.error('Failed to update project:', err);
            setError(err.message || 'Failed to update project');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteProject = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await databases.deleteDocument(DB_ID, PROJECTS_COLLECTION_ID, id);
            setProjects((prev) => prev.filter((p) => p.$id !== id));
            return true;
        } catch (err: any) {
            console.error('Failed to delete project:', err);
            setError(err.message || 'Failed to delete project');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        projects,
        loading,
        error,
        fetchProjects,
        getProjectBySlug,
        getProjectById,
        createProject,
        updateProject,
        deleteProject,
    };
}
