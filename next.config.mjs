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
        hostname: "https://admin.singingbowlvillagenepal.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
