import { toast } from "@/components/ui/use-toast"

// Interface for user data
export interface User {
  id: string
  name: string
  email?: string
  createdAt: string
  lastLogin?: string
  adminId?: string
  department?: string
  role?: string
  status?: string
}

// Debug function to log authentication attempts with detailed information
function logAuthAttempt(action: string, userId: string, success: boolean, details?: any) {
  console.log(`[Auth] ${action} for user ${userId}: ${success ? "SUCCESS" : "FAILED"}`, details || "")
}

// Function to inspect admin-created users
export async function debugInspectAdminUsers(adminId: string): Promise<User[]> {
  try {
    const response = await fetch('/api/auth/users')
    if (!response.ok) throw new Error('Failed to fetch users')
    const users = await response.json()
    return users.filter((user: User) => user.adminId === adminId)
  } catch (error) {
    console.error("[Auth Debug] Error inspecting admin users:", error)
    return []
  }
}

// Debug function to inspect users in the database
export async function debugInspectUsers(): Promise<User[]> {
  try {
    const response = await fetch('/api/auth')
    if (!response.ok) throw new Error('Failed to fetch users')
    return await response.json()
  } catch (error) {
    console.error("Error inspecting users:", error)
    return []
  }
}

// Find user by ID
export async function findUserById(id: string): Promise<User | undefined> {
  try {
    const response = await fetch('/api/auth')
    if (!response.ok) throw new Error('Failed to fetch users')
    const users = await response.json()
    return users.find((user: User) => user.id === id)
  } catch (error) {
    console.error(`[Auth Debug] Error finding user ${id}:`, error)
    return undefined
  }
}

// Register a new user
export async function registerUser(
  userData: Omit<User, "createdAt"> & { password: string },
): Promise<User | null> {
  try {
    logAuthAttempt("Registration", userData.id, true)

    const response = await fetch('/api/auth', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      logAuthAttempt("Registration", userData.id, false, { reason: error.error })
      toast({
        title: "Registration Failed",
        description: error.error || "An error occurred during registration.",
        variant: "destructive",
      })
      return null
    }

    const newUser = await response.json()
    logAuthAttempt("User saved to database", userData.id, true, {
      userDetails: {
        id: newUser.id,
        name: newUser.name,
        adminId: newUser.adminId,
      },
    })

    return newUser
  } catch (error: unknown) {
    console.error("Error registering user:", error)
    logAuthAttempt("Registration", userData.id, false, { error: error instanceof Error ? error.message : 'Unknown error' })
    toast({
      title: "Registration Failed",
      description: "An error occurred during registration. Please try again.",
      variant: "destructive",
    })
    return null
  }
}

// Login user
export async function loginUser(id: string, password: string): Promise<User | null> {
  try {
    logAuthAttempt("Login attempt", id, true)

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      logAuthAttempt("Login", id, false, { reason: error.error })
      return null
    }

    const user = await response.json()
    logAuthAttempt("Login", id, true, { userId: user.id, userName: user.name })
    return user
  } catch (error: unknown) {
    console.error("Error logging in:", error)
    logAuthAttempt("Login", id, false, { error: error instanceof Error ? error.message : 'Unknown error' })
    return null
  }
}

// Get current user from localStorage
export async function getCurrentUser(): Promise<User | null> {
  try {
    const userAuth = localStorage.getItem("userAuth")
    if (!userAuth) return null

    const { id } = JSON.parse(userAuth)
    const user = await findUserById(id)
    return user || null
  } catch (error: unknown) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Set current user in localStorage
export function setCurrentUser(user: User): void {
  try {
    localStorage.setItem(
      "userAuth",
      JSON.stringify({
        id: user.id,
        isLoggedIn: true,
        token: "user-token-" + Math.random().toString(36).substring(2),
      }),
    )
  } catch (error: unknown) {
    console.error("Error setting current user:", error)
  }
}

// Logout current user
export function logoutUser(): void {
  try {
    localStorage.removeItem("userAuth")
  } catch (error) {
    console.error("Error logging out:", error)
  }
}

// Generate password reset token
export async function generateResetToken(userId: string): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/reset-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Error generating reset token:', error)
      return null
    }

    const data = await response.json()
    return data.token
  } catch (error) {
    console.error('Error generating reset token:', error)
    return null
  }
}

// Reset password with token
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Error resetting password:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error resetting password:', error)
    return false
  }
}

// Synchronize admin users with auth system
export async function syncAdminUsers(adminId: string): Promise<void> {
  try {
    const response = await fetch('/api/auth/sync-admin-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminId }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Error synchronizing admin users:', error)
    }
  } catch (error) {
    console.error('Error synchronizing admin users:', error)
  }
}

// Delete user
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Error deleting user:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    return false
  }
}

// Update user password
export async function updateUserPassword(id: string, newPassword: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, newPassword }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Error updating password:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error updating password:', error)
    return false
  }
}

