import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const api = process.env.API_ORIGIN ?? "http://127.0.0.1:3001";
    return [{ source: "/wantam-api/:path*", destination: `${api}/:path*` }];
  },
  transpilePackages: ["@wantam/shared"],
};

export default nextConfig;
