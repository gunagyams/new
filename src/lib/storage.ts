import { supabase } from './supabase';

export type StorageBucket = 'images' | 'project-thumbnails' | 'blog-images';

export interface UploadImageOptions {
  bucket: StorageBucket;
  file: File;
  path?: string;
  upsert?: boolean;
}

export interface UploadImageResult {
  url: string;
  path: string;
  error?: string;
}

export function getStorageUrl(bucket: StorageBucket, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function normalizeImageUrl(url: string, cacheBust: boolean = false): string {
  if (!url) return '';

  if (url.includes('supabase')) {
    return cacheBust ? `${url}?t=${Date.now()}` : url;
  }

  return url;
}

export async function uploadImage(options: UploadImageOptions): Promise<UploadImageResult> {
  const { bucket, file, path, upsert = false } = options;

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const ext = file.name.split('.').pop();
  const fileName = path || `${bucket}/${bucket}_${timestamp}_${randomStr}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert,
    });

  if (error) {
    return { url: '', path: '', error: error.message };
  }

  const url = getStorageUrl(bucket, data.path);

  return { url, path: data.path };
}

export async function deleteImage(bucket: StorageBucket, path: string): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error('Error deleting image:', error);
    return false;
  }

  return true;
}

export function extractPathFromUrl(url: string, bucket: StorageBucket): string | null {
  if (!url || !url.includes('supabase')) {
    return null;
  }

  const pattern = new RegExp(`/object/public/${bucket}/(.+?)(?:\\?|$)`);
  const match = url.match(pattern);

  return match ? match[1] : null;
}

export async function updateImage(
  bucket: StorageBucket,
  currentUrl: string,
  newFile: File,
  path?: string
): Promise<UploadImageResult> {
  const currentPath = extractPathFromUrl(currentUrl, bucket);

  if (currentPath) {
    await deleteImage(bucket, currentPath);
  }

  return uploadImage({ bucket, file: newFile, path });
}
