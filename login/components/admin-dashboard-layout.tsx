"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Settings, LogOut, ShieldCheck, Bell } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

interface AdminDashboardLayoutProps {
  children: React.ReactNode
  adminData: {
    id: string
    name: string
  }
  activeItem?: string
  setActiveItem?: (item: string) => void
}

export function AdminDashboardLayout({
  children,
  adminData,
  activeItem = "dashboard",
  setActiveItem,
}: AdminDashboardLayoutProps) {
  const router = useRouter()
  const { t, dir } = useLanguage()
  const [notifications, setNotifications] = useState(2)

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/")
  }

  const handleMenuClick = (item: string) => {
    if (setActiveItem) {
      setActiveItem(item)
    }
  }

  const handleNotificationClick = () => {
    toast({
      title: t("notifications"),
      description: t("unread_notifications", { count: 2 }),
      duration: 3000,
    })
    setNotifications(0)
  }

  // Map sidebar items to tab values
  const getTabValue = (item: string) => {
    switch (item) {
      case "dashboard":
        return "overview"
      case "users":
        return "users"
      case "settings":
        return "settings"
      default:
        return "overview"
    }
  }

  // Map tab values to sidebar items
  useEffect(() => {
    if (activeItem === "profile") return // Profile doesn't have a sidebar item

    const sidebarItem = activeItem === "overview" ? "dashboard" : activeItem
    // No need to update state if it's already the active item
  }, [activeItem])

  return (
    <SidebarProvider>
      <Toaster />
      <div className="flex h-screen overflow-hidden" dir={dir}>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <ShieldCheck className="h-6 w-6 text-blue-600 rtl-ignore" />
              <div>
                <h3 className="font-semibold">{t("admin_portal")}</h3>
                <p className="text-xs text-muted-foreground">{adminData.name}</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={getTabValue(activeItem) === "overview"}
                  onClick={() => handleMenuClick("overview")}
                >
                  <LayoutDashboard className="h-5 w-5 rtl-ignore" />
                  <span>{t("dashboard")}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={getTabValue(activeItem) === "users"}
                  onClick={() => handleMenuClick("users")}
                >
                  <Users className="h-5 w-5 rtl-ignore" />
                  <span>{t("user_management")}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={getTabValue(activeItem) === "settings"}
                  onClick={() => handleMenuClick("settings")}
                >
                  <Settings className="h-5 w-5 rtl-ignore" />
                  <span>{t("settings")}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <Button variant="ghost" className="w-full justify-start px-4" onClick={handleLogout}>
              <LogOut className="mr-2 h-5 w-5 rtl-ignore" />
              {t("logout")}
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="border-b bg-background">
            <div className="flex h-16 items-center px-4">
              <SidebarTrigger />
              <div className="ml-auto flex items-center space-x-4">
                <LanguageSwitcher />
                <div className="relative">
                  {notifications > 0 && (
                    <span className="absolute right-1 top-1 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
                    </span>
                  )}
                  <Button variant="outline" size="icon" className="rounded-full" onClick={handleNotificationClick}>
                    <span className="sr-only">{t("notifications")}</span>
                    <Bell className="h-5 w-5 rtl-ignore" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => handleMenuClick("profile")}>
                  <ShieldCheck className="h-4 w-4 rtl-ignore" />
                  <span>
                    {t("admin")} {adminData.id}
                  </span>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto py-6">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

