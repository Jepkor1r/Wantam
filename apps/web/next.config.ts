import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: dir,
  async redirects() {
    return [
      { source: "/consent", destination: "/dashboard/consent", permanent: false },
      { source: "/channels", destination: "/dashboard/channels", permanent: false },
      { source: "/channels/:slug", destination: "/dashboard/channels/:slug", permanent: false },
      { source: "/inbox", destination: "/dashboard/messaging?tab=in", permanent: false },
      { source: "/dashboard/inbox", destination: "/dashboard/messaging?tab=in", permanent: false },
      { source: "/outbox", destination: "/dashboard/messaging?tab=out", permanent: false },
      { source: "/dashboard/outbox", destination: "/dashboard/messaging?tab=out", permanent: false },
      { source: "/shelf", destination: "/dashboard/shelf", permanent: false },
      { source: "/till", destination: "/dashboard/till", permanent: false },
      { source: "/people", destination: "/dashboard/people", permanent: false },
      { source: "/brief", destination: "/dashboard/brief", permanent: false },
      { source: "/messaging", destination: "/dashboard/messaging", permanent: false },
      { source: "/credit", destination: "/dashboard/credit", permanent: false },
      { source: "/savings", destination: "/dashboard/savings", permanent: false },
      { source: "/board", destination: "/dashboard/board", permanent: false },
    ];
  },
};

export default nextConfig;

