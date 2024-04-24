/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: ["https://uploadthing.com/*", "https://utfs.io/*"],
  },
  experimental: { typedRoutes: true },
};

export default nextConfig;
