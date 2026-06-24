import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      const firstError = result.error.errors[0]
      return NextResponse.json(
        { success: false, message: firstError?.message ?? 'Invalid input.' },
        { status: 400 }
      )
    }

    const { name, email, message } = result.data

    // TODO: plug in Resend / SendGrid here
    // await resend.emails.send({
    //   from: 'noreply@xdinar.io',
    //   to: process.env.CONTACT_EMAIL ?? 'contact@xdinar.io',
    //   subject: `Contact from ${name}`,
    //   text: `From: ${name} <${email}>\n\n${message}`,
    // })
    console.log('[contact] New message from:', { name, email, message })

    return NextResponse.json({ success: true, message: 'Message received!' })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
