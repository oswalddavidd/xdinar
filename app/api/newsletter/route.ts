import { NextRequest, NextResponse } from 'next/server'
import { newsletterSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = newsletterSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.errors[0]?.message ?? 'Invalid email.' },
        { status: 400 }
      )
    }

    const { email } = result.data

    // TODO: plug in Resend / Mailchimp here
    // await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID })
    console.log('[newsletter] New subscriber:', email)

    return NextResponse.json({ success: true, message: "You're in!" })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
