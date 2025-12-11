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
        hostname: "api.singingbowlvillagenepal.com",
      },
      {
        protocol: "https",
        hostname: "api.singingbowlvillagenepal.com",
      },
      {
        protocol: "https",
        hostname: "api.singingbowlvillagenepal.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "admin.singingbowlvillagenepal.com",
        pathname: "/**",
      },
    ],
  },
  // Fix for Windows EPERM error during build
  experimental: {
    workerThreads: false,
    cpus: 1
  },
  // Reduce webpack parallelism
  webpack: (config, { isServer }) => {
    config.parallelism = 1;
    return config;
  }
};

export default nextConfig;