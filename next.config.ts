import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Lets the iPad (or any device on the LAN) load the dev server via the
  // Mac's local IP — Next.js blocks cross-origin dev requests by default.
  // Wildcard covers the whole /24 subnet so this survives DHCP reassigning
  // the Mac's IP; narrow this (or list exact IPs) before shipping to prod.
  allowedDevOrigins: ["192.168.0.*"],
};

export default nextConfig;
