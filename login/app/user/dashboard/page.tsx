"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, User, Settings, LogOut, Home, Bell, FileText } from "lucide-react"
import { getCurrentUser, logoutUser, type User as UserType } from "@/lib/auth-utils"
import { UserProfile } from "@/components/user-profile"
import { UserSettings } from "@/components/user-settings"

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Check if user is logged in
    try {
      const currentUser = getCurrentUser()
      console.log("Dashboard - Current user:", currentUser?.id || "none")

      if (!currentUser) {
        console.log("No authenticated user found, redirecting to login")
        router.push("/")
        return
      }

      setUser(currentUser)
    } catch (error) {
      console.error("Error checking authentication:", error)
      setError("Authentication error. Please log in again.")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    logoutUser()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-green-100 p-2">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">User Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button
                    variant={activeTab === "overview" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("overview")}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Overview
                  </Button>
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant={activeTab === "settings" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Overview</CardTitle>
                  <CardDescription>View your account summary and recent activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">Active</div>
                          <p className="text-xs text-muted-foreground">
                            Since {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Last Login</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "N/A"}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString() : "First login"}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">User ID</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{user.id}</div>
                          <p className="text-xs text-muted-foreground">Your unique identifier</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">Logged in to account</p>
                              <p className="text-sm text-muted-foreground">Just now</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">Profile viewed</p>
                              <p className="text-sm text-muted-foreground">Yesterday at 2:30 PM</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">Password changed</p>
                              <p className="text-sm text-muted-foreground">3 days ago</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "profile" && <UserProfile user={user} setUser={setUser} />}

            {activeTab === "settings" && <UserSettings user={user} />}
          </div>
        </div>
      </div>
    </div>
  )
}

