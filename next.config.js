/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },

  // Include the images directory in the serverless function bundle
  // so /api/img can read garment photos and try-on outputs on Vercel
  experimental: {
    outputFileTracingIncludes: {
      '/api/img': ['./images/**/*'],
    },
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'ngrok-skip-browser-warning', value: 'true' },
        ],
      },
    ]
  },
}
module.exports = nextConfig
