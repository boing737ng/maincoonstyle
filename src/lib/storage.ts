import "server-only";
import { Client } from "minio";
import { randomUUID } from "node:crypto";
import { publicUrl as buildPublicUrl } from "@/lib/shared";

const ALLOWED_EXTENSIONS: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

function getMinioClient(): Client {
  const endPoint = process.env.S3_ENDPOINT || "localhost";
  const port = Number(process.env.S3_PORT || 9000);
  const useSSL = process.env.S3_USE_SSL === "true";
  const accessKey = process.env.S3_ACCESS_KEY || "";
  const secretKey = process.env.S3_SECRET_KEY || "";

  return new Client({ endPoint, port, useSSL, accessKey, secretKey });
}

const BUCKET = process.env.S3_BUCKET || "meinkun-photos";

export async function uploadPhoto(file: File): Promise<{ objectKey: string; url: string }> {
  const client = getMinioClient();

  // Only the basename, no paths: prevents traversal via crafted file names.
  const baseName = file.name.split(/[\\/]/).pop() ?? "";
  const ext = baseName.includes(".") ? baseName.split(".").pop()!.toLowerCase() : "";
  const contentType = ALLOWED_EXTENSIONS[ext];
  if (!contentType) {
    throw new Error("Недопустимый тип файла");
  }

  const objectKey = `animals/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await client.putObject(BUCKET, objectKey, buffer, buffer.length, {
    "Content-Type": contentType,
  });

  return { objectKey, url: buildPublicUrl(objectKey) };
}

export async function deletePhoto(objectKey: string): Promise<void> {
  const client = getMinioClient();
  await client.removeObject(BUCKET, objectKey);
}

export { publicUrl } from "@/lib/shared";
