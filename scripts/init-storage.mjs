import { Client } from "minio";

const endpoint = process.env.S3_ENDPOINT || "minio";
const port = Number(process.env.S3_PORT || 9000);
const useSSL = process.env.S3_USE_SSL === "true";
const accessKey = process.env.S3_ACCESS_KEY;
const secretKey = process.env.S3_SECRET_KEY;
const bucket = process.env.S3_BUCKET || "meinkun-photos";

if (!accessKey || !secretKey) {
  throw new Error("S3_ACCESS_KEY and S3_SECRET_KEY must be set");
}

const client = new Client({ endPoint: endpoint, port, useSSL, accessKey, secretKey });

for (let attempt = 1; attempt <= 30; attempt += 1) {
  try {
    if (!(await client.bucketExists(bucket))) {
      await client.makeBucket(bucket);
    }

    await client.setBucketPolicy(
      bucket,
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucket}/*`],
          },
        ],
      }),
    );

    console.log(`Object storage ready: ${bucket}`);
    process.exit(0);
  } catch (error) {
    if (attempt === 30) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
