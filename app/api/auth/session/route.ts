import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { access_token } = await request.json()
  const cookieStore = await cookies()

  if (access_token) {
    cookieStore.set('sb-access-token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
  } else {
    cookieStore.delete('sb-access-token')
  }

  return NextResponse.json({ success: true })
}
