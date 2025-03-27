"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Lock,
  UserCheck,
  UserX,
  AlertTriangle,
  Copy,
  Loader2,
  AlertCircle,
  Users,
  RefreshCw,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { registerUser, resetPassword, generateResetToken, syncAdminUsers } from "@/lib/auth-utils"

interface User {
  id: string
  name: string
  status: string
  createdAt: string
  department: string
  role: string
  adminId?: string
}

interface UserManagementProps {
  adminId: string
}

export function UserManagement({ adminId }: UserManagementProps) {
  // State for user management
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isSyncing, setIsSyncing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // State for create user dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    password: "",
    confirmPassword: "",
    department: "",
    role: "Standard",
  })
  const [formError, setFormError] = useState("")

  // State for edit user dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    department: "",
    role: "",
  })

  // State for reset password dialog
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [showGeneratedPassword, setShowGeneratedPassword] = useState(false)

  // State for delete user dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Load users from database on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/auth')
        if (!response.ok) throw new Error('Failed to fetch users')
        const allUsers = await response.json()
        // Filter users for this admin
        const adminUsers = allUsers.filter((user: User) => user.adminId === adminId)
        setUsers(adminUsers)
      } catch (error) {
        console.error("Error loading users:", error)
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [adminId])

  // Add this useEffect for debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Then update the filteredUsers definition to use the debounced term
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    )
  }, [users, debouncedSearchTerm])

  // Generate a secure password
  const generateSecurePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  // Synchronize admin users with auth system
  const handleSyncUsers = async () => {
    setIsSyncing(true)
    try {
      syncAdminUsers(adminId)

      toast({
        title: "Users Synchronized",
        description: "All users have been synchronized with the authentication system.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error synchronizing users:", error)
      toast({
        title: "Synchronization Failed",
        description: "Failed to synchronize users. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // Handle create user
  const handleCreateUser = async () => {
    // Validate form
    if (!newUser.id || !newUser.name || !newUser.password) {
      setFormError("All fields are required")
      return
    }

    if (newUser.password !== newUser.confirmPassword) {
      setFormError("Passwords do not match")
      return
    }

    // Check if ID already exists
    if (users.some((user) => user.id.toLowerCase() === newUser.id.toLowerCase())) {
      setFormError("User ID already exists")
      return
    }

    try {
      // Register the user in the auth system
      const registeredUser = await registerUser({
        id: newUser.id,
        name: newUser.name,
        password: newUser.password,
        adminId: adminId,
        department: newUser.department,
        role: newUser.role,
        status: "active",
      })

      if (!registeredUser) {
        setFormError("Failed to register user in the authentication system")
        return
      }

      // Refresh the user list from the database
      const response = await fetch('/api/auth')
      if (!response.ok) throw new Error('Failed to fetch users')
      const allUsers = await response.json()
      const adminUsers = allUsers.filter((user: User) => user.adminId === adminId)
      setUsers(adminUsers)

      // Reset form and close dialog
      setIsCreateDialogOpen(false)
      setNewUser({
        id: "",
        name: "",
        password: "",
        confirmPassword: "",
        department: "",
        role: "Standard",
      })
      setFormError("")

      // Show success message
      toast({
        title: "User Created",
        description: `User ${registeredUser.name} has been created successfully.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error registering user:", error)
      setFormError("Failed to register user. Please try again.")
    }
  }

  // Handle edit user
  const handleEditUser = (user: User) => {
    // Reset any previous states
    setFormError("")
    setEditingUser(user)
    setEditFormData({
      name: user.name,
      department: user.department,
      role: user.role,
    })
    setIsEditDialogOpen(true)
  }

  // Save edited user
  const saveEditedUser = async () => {
    if (!editingUser) return

    // Validate form
    if (!editFormData.name) {
      setFormError("Name is required")
      return
    }

    try {
      // Close dialog first
      setIsEditDialogOpen(false)

      // Update user in the database
      const response = await fetch('/api/auth', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingUser.id,
          name: editFormData.name,
          department: editFormData.department,
          role: editFormData.role,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      // Refresh the user list from the database
      const usersResponse = await fetch('/api/auth')
      if (!usersResponse.ok) throw new Error('Failed to fetch users')
      const allUsers = await usersResponse.json()
      const adminUsers = allUsers.filter((user: User) => user.adminId === adminId)
      setUsers(adminUsers)

      setEditingUser(null)

      // Show success message
      toast({
        title: "User Updated",
        description: `User ${editFormData.name} has been updated successfully.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  // Handle reset password
  const handleResetPassword = (user: User) => {
    setResetPasswordUser(user)
    setNewPassword(generateSecurePassword())
    setIsResetPasswordDialogOpen(true)
  }

  // Confirm reset password
  const confirmResetPassword = async () => {
    if (!resetPasswordUser) return

    try {
      // Close dialog first
      setIsResetPasswordDialogOpen(false)

      // Update the user's password in the authentication system
      const token = await generateResetToken(resetPasswordUser.id)
      if (!token) {
        toast({
          title: "Error",
          description: "Failed to generate reset token. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
        return
      }

      const resetResult = await resetPassword(token, newPassword)
      if (!resetResult) {
        toast({
          title: "Error",
          description: "Failed to reset password. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
        return
      }

      // Show success message
      toast({
        title: "Password Reset",
        description: `Password for ${resetPasswordUser.name} has been reset successfully.`,
        duration: 3000,
      })

      // Reset state
      setResetPasswordUser(null)
      setNewPassword("")
    } catch (error) {
      console.error("Error resetting password:", error)
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  // Copy password to clipboard
  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(newPassword)
    toast({
      title: "Password Copied",
      description: "The password has been copied to clipboard.",
      duration: 2000,
    })
  }

  // Handle toggle user status (activate/deactivate)
  const toggleUserStatus = async (userId: string) => {
    try {
      // Find the user to update
      const userToUpdate = users.find((user) => user.id === userId)
      if (!userToUpdate) return

      const newStatus = userToUpdate.status === "active" ? "inactive" : "active"
      const userName = userToUpdate.name

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Update users state
      const updatedUsers = users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            status: newStatus,
          }
        }
        return user
      })

      setUsers(updatedUsers)

      // Show success message
      toast({
        title: newStatus === "active" ? "User Activated" : "User Deactivated",
        description: `${userName} has been ${newStatus === "active" ? "activated" : "deactivated"} successfully.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error toggling user status:", error)
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  // Handle delete user
  const handleDeleteUser = (user: User) => {
    // Reset any previous deletion state
    setIsDeleting(false)
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete user
  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      // Set deleting state to show loading indicator
      setIsDeleting(true)

      // Store user info before deletion for the toast message
      const deletedUserName = userToDelete.name
      const deletedUserId = userToDelete.id

      // Close dialog first to prevent UI blocking
      setIsDeleteDialogOpen(false)

      // Delete user from the database
      const response = await fetch('/api/auth', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deletedUserId }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      // Refresh the user list from the database
      const usersResponse = await fetch('/api/auth')
      if (!usersResponse.ok) throw new Error('Failed to fetch users')
      const allUsers = await usersResponse.json()
      const adminUsers = allUsers.filter((user: User) => user.adminId === adminId)
      setUsers(adminUsers)

      // Show success message
      toast({
        title: "User Deleted",
        description: `User ${deletedUserName} has been permanently deleted.`,
        duration: 3000,
      })
    } catch (error) {
      // Handle any errors
      console.error("Error deleting user:", error)

      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      // Reset states
      setIsDeleting(false)
      setUserToDelete(null)
    }
  }

  // Add this useEffect hook to clean up any pending operations when the component unmounts
  useEffect(() => {
    return () => {
      // Clean up any pending operations
      setUserToDelete(null)
      setEditingUser(null)
      setResetPasswordUser(null)
      setIsDeleting(false)
    }
  }, [])

  // Add loading state to the UI
  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    )
  }

  // Add this at the beginning of the return statement
  try {
    return (
      <div className="space-y-4">
        {isDeleting && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background shadow-lg">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{isDeleting ? "Deleting user..." : "Processing..."}</p>
            </div>
          </div>
        )}
        <Toaster />
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Create and manage users for your organization</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSyncUsers} disabled={isSyncing}>
                  {isSyncing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Users
                    </>
                  )}
                </Button>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>Create a new user account with a unique ID and password.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {formError && <div className="text-sm font-medium text-red-500">{formError}</div>}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="user-id">User ID</Label>
                          <Input
                            id="user-id"
                            placeholder="Enter unique user ID"
                            value={newUser.id}
                            onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="user-name">Full Name</Label>
                          <Input
                            id="user-name"
                            placeholder="Enter user's full name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="user-department">Department</Label>
                          <Select
                            value={newUser.department}
                            onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                          >
                            <SelectTrigger id="user-department">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                              <SelectItem value="IT">IT</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="HR">HR</SelectItem>
                              <SelectItem value="General">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="user-role">Role</Label>
                          <Select
                            value={newUser.role}
                            onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                          >
                            <SelectTrigger id="user-role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Standard">Standard</SelectItem>
                              <SelectItem value="Manager">Manager</SelectItem>
                              <SelectItem value="Supervisor">Supervisor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="user-password">Password</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const generatedPassword = generateSecurePassword()
                              setNewUser({
                                ...newUser,
                                password: generatedPassword,
                                confirmPassword: generatedPassword,
                              })
                            }}
                          >
                            Generate Password
                          </Button>
                        </div>
                        <Input
                          id="user-password"
                          type="password"
                          placeholder="Create a secure password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-confirm-password">Confirm Password</Label>
                        <Input
                          id="user-confirm-password"
                          type="password"
                          placeholder="Confirm password"
                          value={newUser.confirmPassword}
                          onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateUser}>Create User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by ID or name..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Filter</Button>
            </div>

            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-md bg-muted/20">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Users Yet</h3>
                <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                  You haven't created any users yet. Click the "Create User" button above to add your first user.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First User
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className={user.status === "inactive" ? "bg-muted/50" : ""}>
                          <TableCell className="font-medium">{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>
                            <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                          </TableCell>
                          <TableCell>{user.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                {user.status === "active" ? (
                                  <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Activate
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} users
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information for {editingUser?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {formError && <div className="text-sm font-medium text-red-500">{formError}</div>}
              <div className="space-y-2">
                <Label htmlFor="edit-user-id">User ID</Label>
                <Input id="edit-user-id" value={editingUser?.id || ""} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">User ID cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-user-name">Full Name</Label>
                <Input
                  id="edit-user-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-user-department">Department</Label>
                  <Select
                    value={editFormData.department}
                    onValueChange={(value) => setEditFormData({ ...editFormData, department: value })}
                  >
                    <SelectTrigger id="edit-user-department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-user-role">Role</Label>
                  <Select
                    value={editFormData.role}
                    onValueChange={(value) => setEditFormData({ ...editFormData, role: value })}
                  >
                    <SelectTrigger id="edit-user-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveEditedUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>Reset password for user {resetPasswordUser?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">Generated Password</h4>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type={showGeneratedPassword ? "text" : "password"}
                    value={newPassword}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowGeneratedPassword(!showGeneratedPassword)}
                  >
                    {showGeneratedPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-eye-off"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                        <line x1="2" x2="22" y1="2" y2="22"></line>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-eye"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={copyPasswordToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This password will be set for the user. Make sure to securely share it with them.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-password">Or set a custom password</Label>
                <Input
                  id="custom-password"
                  type="text"
                  placeholder="Enter custom password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmResetPassword}>Reset Password</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Delete User
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this user? This action cannot be undone and will permanently remove the
                user and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <div className="rounded-md bg-muted p-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">User ID:</span>
                    <span className="text-sm">{userToDelete?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm">{userToDelete?.name}</span>
                  </div>
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={confirmDeleteUser}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  } catch (error) {
    console.error("Error rendering user management:", error)
    return (
      <div className="p-8 text-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            An error occurred while rendering the user management interface. Please refresh the page and try again.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    )
  }
}

