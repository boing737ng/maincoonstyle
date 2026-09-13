import type { NextConfig } from "next";

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

const s3PublicUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL;

const remotePatterns: RemotePattern[] = [
  {
    protocol: "http",
    hostname: "localhost",
    port: "9000",
    pathname: "/**",
  },
  {
    protocol: "http",
    hostname: "127.0.0.1",
    port: "9000",
    pathname: "/**",
  },
];

if (s3PublicUrl) {
  try {
    const url = new URL(s3PublicUrl);
    remotePatterns.push({
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port || "",
      pathname: "/**",
    });
  } catch {
    console.warn(`NEXT_PUBLIC_S3_PUBLIC_URL не является корректным URL: ${s3PublicUrl}`);
  }
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "60mb",
    },
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns,
  },
};

export default nextConfig;
