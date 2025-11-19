// app/utils/readCache.ts
import fs from 'fs/promises';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'cache', 'shops.json');

export async function getCachedShops() {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    const json = JSON.parse(data);
    return { shops: Array.isArray(json.shops) ? json.shops : [] };
  } catch (error: any) {
    console.warn('Instagram cache not loaded (normal in dev or if file missing):', error.message);
    return { shops: [] };
  }
}