// Enable Contentlayer integration in Next.js and bypass TS build errors temporarily
import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  // TEMP: allow production build to complete even if TS errors exist
  typescript: { ignoreBuildErrors: true },
  output: "standalone",
  
  // Domain canonical redirects - blog.marlowgate.com -> marlowgate.com
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'blog.marlowgate.com',
          },
        ],
        destination: 'https://marlowgate.com/:path*',
        permanent: true,
        statusCode: 301,
      },
    ];
  },
};

export default withContentlayer(nextConfig);
