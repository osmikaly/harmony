import { NextResponse } from 'next/server'
import { userOperations } from '@/lib/db/database'
import bcrypt from 'bcryptjs'

// Interface for user data
interface UserData {
  id: string
  name: string
  email?: string
  password: string
  adminId?: string
  department?: string
  role?: string
  status?: string
}

// Helper function to convert database user to API response
function convertDbUserToUser(dbUser: any) {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    createdAt: dbUser.created_at,
    lastLogin: dbUser.last_login,
    adminId: dbUser.admin_id,
    department: dbUser.department,
    role: dbUser.role,
    status: dbUser.status
  }
}

// GET /api/auth/users - Get all users
export async function GET() {
  try {
    const users = await new Promise<any[]>((resolve, reject) => {
      userOperations.db.all('SELECT * FROM users', [], (err: any, rows: any[]) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
    return NextResponse.json(users.map(convertDbUserToUser))
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST /api/auth/login - Login user
export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body || !body.id || !body.password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { id, password } = body

    // Find user by ID
    const user = await userOperations.findById(id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify password
    const passwordValid = await userOperations.verifyPassword(password, user.password_hash)
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Update last login
    await userOperations.updateLastLogin(id)

    return NextResponse.json(convertDbUserToUser(user))
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}

// PUT /api/auth/register - Register new user
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body || !body.id || !body.name || !body.password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const userData: UserData = {
      id: body.id,
      name: body.name,
      email: body.email,
      password: body.password,
      adminId: body.adminId,
      department: body.department,
      role: body.role,
      status: body.status || 'active'
    }
    
    // Check if user exists
    const existingUser = await userOperations.findById(userData.id)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User ID already exists' },
        { status: 400 }
      )
    }

    // Create new user
    const newUser = await userOperations.create(userData)
    if (!newUser) {
      throw new Error('Failed to create user')
    }

    return NextResponse.json(convertDbUserToUser(newUser))
  } catch (error) {
    console.error('Error during registration:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}

// DELETE /api/auth - Delete user
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    if (!body || !body.id) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      )
    }

    const { id } = body

    // Delete user from database
    await userOperations.delete(id)

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
} 