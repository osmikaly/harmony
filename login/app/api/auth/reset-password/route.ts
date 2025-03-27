import { NextResponse } from 'next/server'
import { userOperations } from '@/lib/db/database'
import bcrypt from 'bcryptjs'

interface DbUser {
  id: string
  password_hash: string
  reset_token: string | null
  reset_token_expiry: number | null
}

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    // Find user with valid reset token
    const user = await new Promise<DbUser | undefined>((resolve, reject) => {
      userOperations.db.get(
        'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?',
        [token, Date.now()],
        (err, row) => {
          if (err) reject(err)
          else resolve(row as DbUser)
        }
      )
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password and clear reset token
    await userOperations.update(user.id, {
      password_hash: hashedPassword,
      reset_token: null,
      reset_token_expiry: null
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
} 