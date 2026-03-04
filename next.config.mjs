/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: 'standalone' output removed for Netlify compatibility
  // Use 'standalone' for Docker deployments only
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
