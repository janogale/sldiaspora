import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "three/webgpu": "./stubs/three-webgpu-stub.js",
      "three/tsl": "./stubs/three-tsl-stub.js",
    },
  },
};

export default nextConfig;
