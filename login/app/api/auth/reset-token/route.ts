import { NextResponse } from 'next/server'
import { userOperations } from '@/lib/db/database'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await userOperations.findById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex')
    const expiry = Date.now() + 60 * 60 * 1000 // 1 hour from now

    // Save token to database
    await userOperations.update(userId, {
      reset_token: token,
      reset_token_expiry: expiry
    })

    return NextResponse.json({ token })
  } catch (error) {
    console.error('Error generating reset token:', error)
    return NextResponse.json(
      { error: 'Failed to generate reset token' },
      { status: 500 }
    )
  }
} 