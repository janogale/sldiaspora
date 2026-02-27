import type { NextConfig } from "next";

const isVercel = Boolean(process.env.VERCEL);

const nextConfig: NextConfig = isVercel
  ? {}
  : {
      distDir: ".next-tmp",
    };

export default nextConfig;
