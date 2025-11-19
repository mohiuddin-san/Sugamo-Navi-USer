// utils/readCache.ts
import fs from 'fs/promises';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'cache');

export async function getCachedShops() {
  try {
    const data = await fs.readFile(path.join(CACHE_DIR, 'shops.json'), 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.shops || [];
  } catch (error) {
    console.warn('shops.json not found or invalid – returning empty array');
    return [];
  }
}