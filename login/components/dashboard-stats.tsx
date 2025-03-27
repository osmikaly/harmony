"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

interface DashboardStatsProps {
  adminId: string
}

export function DashboardStats({ adminId }: DashboardStatsProps) {
  const { t } = useLanguage()

  // Get actual user data from localStorage or other storage
  const getUserData = () => {
    try {
      const usersString = localStorage.getItem("adminUsers_" + adminId)
      if (!usersString) return { totalUsers: 0, activeUsers: 0, newUsers: 0, inactiveUsers: 0 }

      const users = JSON.parse(usersString)
      if (!Array.isArray(users)) return { totalUsers: 0, activeUsers: 0, newUsers: 0, inactiveUsers: 0 }

      const now = new Date()
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const activeUsers = users.filter((user) => user.status === "active").length
      const newUsers = users.filter((user) => {
        const createdDate = new Date(user.createdAt)
        return createdDate >= sevenDaysAgo
      }).length

      return {
        totalUsers: users.length,
        activeUsers,
        newUsers,
        inactiveUsers: users.length - activeUsers,
      }
    } catch (error) {
      console.error("Error getting user data:", error)
      return { totalUsers: 0, activeUsers: 0, newUsers: 0, inactiveUsers: 0 }
    }
  }

  const userData = getUserData()

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("total_users")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{t("created_by_you")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("active_users")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.activeUsers}</div>
            <p className="text-xs text-muted-foreground">{t("active_users")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("new_users")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.newUsers}</div>
            <p className="text-xs text-muted-foreground">{t("new_users")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("inactive_users")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.inactiveUsers}</div>
            <p className="text-xs text-muted-foreground">{t("inactive_users")}</p>
          </CardContent>
        </Card>
      </div>

      {userData.totalUsers === 0 && (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">{t("no_users_yet")}</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">{t("add_first_user")}</p>
            <Button onClick={() => document.querySelector('[value="users"]')?.dispatchEvent(new Event("click"))}>
              {t("create_user")}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

