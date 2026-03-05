import { Client, Databases, Account, Storage, ID, Query } from 'appwrite';

// ---------------------------------------------------------------------------
// Appwrite Client
// ---------------------------------------------------------------------------
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

// ---------------------------------------------------------------------------
// Collection / Database IDs  (pulled from env vars)
// ---------------------------------------------------------------------------
export const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';
export const CONTACTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CONTACTS_COLLECTION_ID || '';
export const PROJECTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID || '';
export const BLOGS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_BLOGS_COLLECTION_ID || '';
export const LIKES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_LIKES_COLLECTION_ID || '';
export const COMMENTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID || '';
export const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || '';

// ---------------------------------------------------------------------------
// Helper: check if a given collection is configured
// ---------------------------------------------------------------------------
export const isConfigured = (...ids: string[]) => ids.every(Boolean);

// Re-export useful Appwrite helpers so the rest of the app only needs one import
export { ID, Query };
