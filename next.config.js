/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development'

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.binance.org https://*.walletconnect.com https://*.walletconnect.org wss://*.walletconnect.com wss://*.walletconnect.org wss://relay.walletconnect.org",
      "frame-src 'self' https://*.walletconnect.com",
    ].join('; '),
  },
]

const nextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },
  compress: true,
  poweredByHeader: false,
  async headers() {
    if (isDev) return []
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

module.exports = nextConfig