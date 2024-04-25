/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // "https://uploadthing.com/*", "https://utfs.io/*"
    remotePatterns: [
      { protocol: "https", hostname: "uploadthing.com" },
      { protocol: "https", hostname: "utfs.io" },
    ],
  },
  experimental: {
    turbo: { resolveExtensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".mjs", ".cjs"] },
  },
};

export default nextConfig;
