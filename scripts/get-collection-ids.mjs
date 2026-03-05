import { Client, Databases } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69a1c49e000f514136ff')
    .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const cols = await db.listCollections('69a4841a0004318eda5d');
console.log(`Total collections: ${cols.total}`);
cols.collections.forEach(c => console.log(`  "${c.name}" => ${c.$id}`));
