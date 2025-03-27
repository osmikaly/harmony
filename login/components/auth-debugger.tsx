"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { debugInspectUsers, debugInspectAdminUsers, User } from "@/lib/auth-utils"
import { AlertCircle, Bug, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/lib/language-context"

interface AuthDebuggerProps {
  adminId?: string
}

export function AuthDebugger({ adminId }: AuthDebuggerProps) {
  const { t } = useLanguage()
  const [showDebug, setShowDebug] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [adminUsers, setAdminUsers] = useState<User[]>([])
  const [activeTab, setActiveTab] = useState("auth")

  useEffect(() => {
    const fetchUsers = async () => {
      const currentUsers = await debugInspectUsers()
      setUsers(currentUsers)
      
      if (adminId) {
        const currentAdminUsers = await debugInspectAdminUsers(adminId)
        setAdminUsers(currentAdminUsers)
      }
    }
    fetchUsers()
  }, [adminId])

  const handleInspectUsers = async () => {
    const currentUsers = await debugInspectUsers()
    setUsers(currentUsers)
    
    if (adminId) {
      const currentAdminUsers = await debugInspectAdminUsers(adminId)
      setAdminUsers(currentAdminUsers)
    }
    setShowDebug(true)
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          {t("debug_settings")}
        </CardTitle>
        <CardDescription>{t("debug_description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {showDebug ? (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t("found")} {users.length} {t("users_in_system")}
                {adminUsers.length > 0 && ` ${t("and")} ${adminUsers.length} ${t("users_created_by_admin")}`}
              </AlertDescription>
            </Alert>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="auth">{t("auth_system_users")}</TabsTrigger>
                {adminUsers.length > 0 && <TabsTrigger value="admin">{t("admin_created_users")}</TabsTrigger>}
              </TabsList>

              <TabsContent value="auth" className="mt-4">
                <div className="rounded-md border">
                  <div className="p-4">
                    <h3 className="font-medium mb-2">{t("auth_system_users")}</h3>
                    <pre className="bg-muted p-2 rounded-md text-xs overflow-auto max-h-60">
                      {JSON.stringify(users, null, 2)}
                    </pre>
                  </div>
                </div>
              </TabsContent>

              {adminUsers.length > 0 && (
                <TabsContent value="admin" className="mt-4">
                  <div className="rounded-md border">
                    <div className="p-4">
                      <h3 className="font-medium mb-2">{t("admin_created_users")}</h3>
                      <pre className="bg-muted p-2 rounded-md text-xs overflow-auto max-h-60">
                        {JSON.stringify(adminUsers, null, 2)}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>

            <div className="flex justify-end">
              <Button variant="outline" onClick={handleInspectUsers}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {t("refresh_data")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button onClick={handleInspectUsers}>{t("inspect_auth_system")}</Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">{t("debug_tool_note")}</CardFooter>
    </Card>
  )
}

