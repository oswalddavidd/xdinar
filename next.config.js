/** @type {import('next').NextConfig} */

const { NETWORKS, NETWORK_NAME } = require('./lib/networks')

const isDev = process.env.NODE_ENV === 'development'

// connect-src allows the active network's RPCs. Use full origins so non-default ports
// (e.g. :8545) are kept: a CSP host without a port only matches 443.
const rpcOrigins = [...new Set(NETWORKS[NETWORK_NAME].rpcUrls.map((u) => new URL(u).origin))]

const connectSrc = [
  "'self'",
  ...rpcOrigins,
  'https://*.walletconnect.com',
  'https://*.walletconnect.org',
  'wss://*.walletconnect.com',
  'wss://*.walletconnect.org',
  'wss://relay.walletconnect.org',
  'https://*.reown.com',
  'wss://*.reown.com',
].join(' ')

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  `connect-src ${connectSrc}`,
  "frame-src 'self' https://*.walletconnect.com",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/whitepaper', destination: 'https://xdinar-token.gitbook.io/xdinar-token-docs', permanent: false },
    ]
  },
  async headers() {
    if (isDev) return []
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

module.exports = nextConfig