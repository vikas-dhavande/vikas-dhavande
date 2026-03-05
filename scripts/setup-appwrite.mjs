#!/usr/bin/env node
/**
 * setup-appwrite.mjs
 * Script to automate Appwrite schema creation for the platform.
 * Usage: APPWRITE_API_KEY=<your-key> node scripts/setup-appwrite.mjs
 */

import { Client, Databases, Permission, Role, ID } from 'node-appwrite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Config ──────────────────────────────────────────────────────────────────
const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID || '69a1c49e000f514136ff';
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '69a4841a0004318eda5d';
const API_KEY = process.env.APPWRITE_API_KEY;

if (!API_KEY) {
    console.error('❌  Missing APPWRITE_API_KEY environment variable.');
    console.error('    Usage: APPWRITE_API_KEY=<your-key> node scripts/setup-appwrite.mjs');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const db = new Databases(client);

async function wait(ms) {
    return new Promise(res => setTimeout(res, ms));
}

async function createCollection(name, schema) {
    console.log(`\n📦 Setting up collection: [${name}]`);
    let collectionId;

    // 1. Create or Find Collection
    try {
        const col = await db.createCollection(
            DATABASE_ID,
            ID.unique(),
            name,
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
        );
        collectionId = col.$id;
        console.log(`✅ Collection created: ${collectionId}`);
    } catch (err) {
        if (err.code === 409) {
            console.log(`ℹ️  Collection ${name} already exists. Finding ID...`);
            const cols = await db.listCollections(DATABASE_ID);
            const existing = cols.collections.find(c => c.name === name);
            if (!existing) throw new Error(`Cannot find existing ${name} collection`);
            collectionId = existing.$id;
            console.log(`🔗 Found Collection ID: ${collectionId}`);
        } else {
            throw err;
        }
    }

    // 2. Create Attributes
    console.log(`📋 Creating attributes for ${name}...`);
    for (const attr of schema) {
        try {
            if (attr.type === 'string') {
                await db.createStringAttribute(DATABASE_ID, collectionId, attr.key, attr.size, attr.required, attr.default, attr.array);
            } else if (attr.type === 'boolean') {
                await db.createBooleanAttribute(DATABASE_ID, collectionId, attr.key, attr.required, attr.default, attr.array);
            } else if (attr.type === 'integer') {
                await db.createIntegerAttribute(DATABASE_ID, collectionId, attr.key, attr.required, attr.min, attr.max, attr.default, attr.array);
            } else if (attr.type === 'datetime') {
                await db.createDatetimeAttribute(DATABASE_ID, collectionId, attr.key, attr.required, attr.default, attr.array);
            }
            console.log(`  + ${attr.key} (${attr.type})`);
            await wait(400); // Rate limit buffer
        } catch (err) {
            if (err.code === 409) {
                console.log(`  ~ ${attr.key} (already exists)`);
            } else {
                console.error(`  ❌ Failed to create attribute ${attr.key}:`, err.message);
            }
        }
    }

    return collectionId;
}

async function main() {
    console.log('🚀 Starting Appwrite Schema Setup...\n');

    // Schema Definitions
    const blogsSchema = [
        { key: 'title', type: 'string', size: 512, required: true },
        { key: 'slug', type: 'string', size: 256, required: true },
        { key: 'content_json', type: 'string', size: 1000000, required: false }, // Store TipTap JSON
        { key: 'status', type: 'string', size: 20, required: true, default: 'draft' }, // draft, published
        { key: 'tags', type: 'string', size: 100, required: false, array: true },
        { key: 'author_id', type: 'string', size: 50, required: true },
        { key: 'read_time', type: 'string', size: 50, required: false },
        { key: 'featured_image', type: 'string', size: 512, required: false },
        // created_at is default in Appwrite documents, but we can make it explicit if needed.
    ];

    const projectsSchema = [
        { key: 'title', type: 'string', size: 256, required: true },
        { key: 'slug', type: 'string', size: 256, required: true },
        { key: 'content_json', type: 'string', size: 1000000, required: false }, // TipTap JSON
        { key: 'description', type: 'string', size: 5000, required: false }, // Short excerpt
        { key: 'repository_url', type: 'string', size: 512, required: false },
        { key: 'live_url', type: 'string', size: 512, required: false },
        { key: 'technologies', type: 'string', size: 100, required: false, array: true },
        { key: 'featured_image', type: 'string', size: 512, required: false },
        { key: 'status', type: 'string', size: 20, required: true, default: 'draft' }, // draft, published
        { key: 'created_by', type: 'string', size: 50, required: true },
    ];

    const documentsSchema = [
        { key: 'project_id', type: 'string', size: 50, required: true },
        { key: 'title', type: 'string', size: 256, required: true },
        { key: 'content_json', type: 'string', size: 1000000, required: false },
        { key: 'version', type: 'string', size: 20, required: true, default: '1.0' },
    ];

    const categoriesSchema = [
        { key: 'name', type: 'string', size: 100, required: true },
        { key: 'slug', type: 'string', size: 100, required: true },
        { key: 'description', type: 'string', size: 1000, required: false },
    ];

    // Execute
    const blogsId = await createCollection('blogs', blogsSchema);
    const projectsId = await createCollection('projects', projectsSchema);
    const documentsId = await createCollection('documents', documentsSchema);
    const categoriesId = await createCollection('categories', categoriesSchema);

    console.log('\n─────────────────────────────────────────');
    console.log('🎉 Setup Complete! Update your .env files:\n');
    console.log(`VITE_APPWRITE_BLOGS_COLLECTION_ID=${blogsId}`);
    console.log(`VITE_APPWRITE_PROJECTS_COLLECTION_ID=${projectsId}`);
    console.log(`VITE_APPWRITE_DOCUMENTS_COLLECTION_ID=${documentsId}`);
    console.log(`VITE_APPWRITE_CATEGORIES_COLLECTION_ID=${categoriesId}`);
    console.log('─────────────────────────────────────────\n');
}

main().catch(err => {
    console.error('\n❌ Setup failed:', err);
    process.exit(1);
});
