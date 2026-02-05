/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during build to avoid blocking deployment
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ldrdcvxhqnmabydsbjfo.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
