import "server-only";
import { Client } from "minio";
import { randomUUID } from "node:crypto";
import { publicUrl as buildPublicUrl } from "@/lib/shared";

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
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const objectKey = `animals/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await client.putObject(BUCKET, objectKey, buffer, buffer.length, {
    "Content-Type": file.type,
  });

  return { objectKey, url: buildPublicUrl(objectKey) };
}

export async function deletePhoto(objectKey: string): Promise<void> {
  const client = getMinioClient();
  await client.removeObject(BUCKET, objectKey);
}

export { publicUrl } from "@/lib/shared";
