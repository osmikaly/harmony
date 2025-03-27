import { NextResponse } from 'next/server'
import { userOperations } from '@/lib/db/database'

export async function POST(request: Request) {
  try {
    const { adminId } = await request.json()

    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      )
    }

    // Get all users created by this admin
    const adminUsers = await new Promise((resolve, reject) => {
      userOperations.db.all(
        'SELECT * FROM users WHERE admin_id = ?',
        [adminId],
        (err, rows) => {
          if (err) reject(err)
          else resolve(rows)
        }
      )
    })

    return NextResponse.json(adminUsers)
  } catch (error) {
    console.error('Error synchronizing admin users:', error)
    return NextResponse.json(
      { error: 'Failed to synchronize admin users' },
      { status: 500 }
    )
  }
} 