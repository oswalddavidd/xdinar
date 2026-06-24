import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limit store (upgrade to Upstash Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/newsletter': { max: 5, windowMs: 60_000 },
  '/api/contact': { max: 3, windowMs: 60_000 },
  '/api/token-price': { max: 30, windowMs: 60_000 },
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const limit = RATE_LIMITS[pathname]

  if (!limit) return NextResponse.next()

  const ip = getClientIp(req)
  const key = `${ip}:${pathname}`
  const now = Date.now()

  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + limit.windowMs })
    return NextResponse.next()
  }

  if (entry.count >= limit.max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(limit.max),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(entry.resetAt),
        },
      }
    )
  }

  entry.count++
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/newsletter', '/api/contact', '/api/token-price'],
}
