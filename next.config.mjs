/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-eu-west-1.amazonaws.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "http://localhost:3000/:path*",
      },

      {
      source: "/uploads/:path*",
      destination: "http://localhost:3000/uploads/:path*",
    },
    ];
  },
};



export default nextConfig;