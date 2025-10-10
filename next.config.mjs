/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "zolpa.api.quarkinfotech.com",
      },
      {
        protocol: "https",
        hostname: "zolpa.api.quarkinfotech.com",
      },
      {
        protocol: 'https',
        hostname: 'api.zolpastore.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'https://admin.zolpastore.com',
        pathname: '/**',
      },
    
    ],
  },
};

export default nextConfig;
