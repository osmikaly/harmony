"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/user-management"
import { DashboardStats } from "@/components/dashboard-stats"
import { AdminProfile } from "@/components/admin-profile"
import { AdminSettings } from "@/components/admin-settings"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLanguage } from "@/lib/language-context"

export default function AdminDashboard() {
  const router = useRouter()
  const { t, dir } = useLanguage()
  const [adminData, setAdminData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Check if admin is logged in
    try {
      const auth = localStorage.getItem("adminAuth")
      if (!auth) {
        router.push("/")
        return
      }

      const parsedAuth = JSON.parse(auth)
      if (!parsedAuth.isLoggedIn) {
        router.push("/")
        return
      }
      setAdminData(parsedAuth)
    } catch (e) {
      setError("Failed to authenticate. Please log in again.")
      router.push("/")
    } finally {
      setLoading(false)
    }
  }, [router])

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary rtl-ignore" />
          <p className="text-sm text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>{t("authentication_error")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!adminData) return null

  return (
    <AdminDashboardLayout adminData={adminData} activeItem={activeTab} setActiveItem={setActiveTab}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h2>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4" dir={dir}>
          <TabsList>
            <TabsTrigger value="overview">{t("dashboard_overview")}</TabsTrigger>
            <TabsTrigger value="users">{t("user_management")}</TabsTrigger>
            <TabsTrigger value="settings">{t("settings")}</TabsTrigger>
            <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <DashboardStats adminId={adminData.id} />

            <Card>
              <CardHeader>
                <CardTitle>{t("welcome_admin")}</CardTitle>
                <CardDescription>{t("admin_hub_description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>{t("admin_hub_description")}</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4 border-dashed border-2">
                      <h3 className="font-medium mb-2">{t("getting_started")}</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• {t("create_first_user")}</li>
                        <li>• {t("configure_settings")}</li>
                        <li>• {t("update_profile")}</li>
                      </ul>
                    </Card>
                    <Card className="p-4 border-dashed border-2">
                      <h3 className="font-medium mb-2">{t("recent_updates")}</h3>
                      <p className="text-sm text-muted-foreground">{t("system_ready")}</p>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagement adminId={adminData.id} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <AdminSettings adminId={adminData.id} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <AdminProfile adminData={adminData} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  )
}

