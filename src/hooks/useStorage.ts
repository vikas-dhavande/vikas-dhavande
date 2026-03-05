import { useState, useCallback } from 'react';
import { storage, STORAGE_BUCKET_ID, ID } from '../lib/appwrite';

export function useStorage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = useCallback(async (file: File): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await storage.createFile(
                STORAGE_BUCKET_ID,
                ID.unique(),
                file
            );
            // Return the file view URL
            return storage.getFileView(STORAGE_BUCKET_ID, response.$id).toString();
        } catch (err: any) {
            console.error('File upload failed:', err);
            setError(err.message || 'Failed to upload file');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getFilePreview = useCallback((fileId: string) => {
        try {
            return storage.getFilePreview(STORAGE_BUCKET_ID, fileId).toString();
        } catch (err) {
            console.error('Failed to get file preview:', err);
            return null;
        }
    }, []);

    const deleteFile = useCallback(async (fileId: string) => {
        setLoading(true);
        setError(null);
        try {
            await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
            return true;
        } catch (err: any) {
            console.error('File deletion failed:', err);
            setError(err.message || 'Failed to delete file');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        uploadFile,
        getFilePreview,
        deleteFile,
        loading,
        error,
    };
}
