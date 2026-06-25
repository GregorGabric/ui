import withVercelToolbar from "@vercel/toolbar/plugins/next"
import { createMDX } from "fumadocs-mdx/next"

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1"],
  async rewrites() {
    return [
      {
        source: "/:path*.md",
        destination: "/llms.mdx/:path*",
      },
    ]
  },
  outputFileTracingIncludes: {
    "/*": ["./registry/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
}

const withMDX = createMDX({})

export default withVercelToolbar()(withMDX(nextConfig))
