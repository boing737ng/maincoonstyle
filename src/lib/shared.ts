export const MAX_PHOTOS_PER_ANIMAL = 5;
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function publicUrl(objectKey: string): string {
  const base = process.env.NEXT_PUBLIC_S3_PUBLIC_URL || "http://localhost:9000";
  const bucket = process.env.NEXT_PUBLIC_S3_BUCKET || "meinkun-photos";
  return `${base.replace(/\/$/, "")}/${bucket}/${objectKey}`;
}