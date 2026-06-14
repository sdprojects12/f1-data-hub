/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.openf1.org",
      },
      {
        protocol: "https",
        hostname: "**.formula1.com",
      },
    ],
  },
};

export default nextConfig;
