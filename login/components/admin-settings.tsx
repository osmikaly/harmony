"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Info, Save, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AuthDebugger } from "@/components/auth-debugger"
import { syncAdminUsers } from "@/lib/auth-utils"
import { useLanguage } from "@/lib/language-context"

interface AdminSettingsProps {
  adminId: string
}

export function AdminSettings({ adminId }: AdminSettingsProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("general")
  const [isSyncing, setIsSyncing] = useState(false)

  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Admin Portal",
    siteDescription: "User management system for administrators",
  })

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: "90",
    sessionTimeout: "30",
    minPasswordLength: "8",
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
  })

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    userCreationNotify: true,
    userDeletionNotify: true,
    passwordResetNotify: true,
    loginAttemptNotify: false,
    weeklyReportNotify: true,
  })

  // Backup settings state
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    backupRetention: "30",
    includeUserData: true,
    includeSystemSettings: true,
    backupLocation: "cloud",
  })

  // Loading states
  const [isSaving, setIsSaving] = useState(false)

  // Handle saving settings
  const handleSaveSettings = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)

      toast({
        title: t("settings_saved"),
        description: t("settings_saved_description"),
        duration: 3000,
      })
    }, 1000)
  }

  // Synchronize users with auth system
  const handleSyncUsers = async () => {
    setIsSyncing(true)
    try {
      syncAdminUsers(adminId)

      toast({
        title: t("users_synchronized"),
        description: t("users_synchronized_description"),
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("admin_settings")}</CardTitle>
          <CardDescription>{t("configure_dashboard")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">{t("general")}</TabsTrigger>
              <TabsTrigger value="security">{t("security")}</TabsTrigger>
              <TabsTrigger value="notifications">{t("notifications")}</TabsTrigger>
              <TabsTrigger value="debug">{t("debug")}</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="site-name" className="text-right">
                    {t("site_name")}
                  </Label>
                  <Input
                    id="site-name"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="site-description" className="text-right">
                    {t("site_description")}
                  </Label>
                  <Textarea
                    id="site-description"
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>{t("security_settings")}</AlertTitle>
                <AlertDescription>{t("security_description")}</AlertDescription>
              </Alert>

              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">{t("two_factor")}</Label>
                    <p className="text-sm text-muted-foreground">{t("two_factor_description")}</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password-expiry" className="text-right">
                    {t("password_expiry")}
                  </Label>
                  <Input
                    id="password-expiry"
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="session-timeout" className="text-right">
                    {t("session_timeout")}
                  </Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="min-password-length" className="text-right">
                    {t("min_password_length")}
                  </Label>
                  <Input
                    id="min-password-length"
                    type="number"
                    value={securitySettings.minPasswordLength}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, minPasswordLength: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="require-special">{t("require_special")}</Label>
                    <p className="text-sm text-muted-foreground">{t("require_special_description")}</p>
                  </div>
                  <Switch
                    id="require-special"
                    checked={securitySettings.requireSpecialChars}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, requireSpecialChars: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="require-numbers">{t("require_numbers")}</Label>
                    <p className="text-sm text-muted-foreground">{t("require_numbers_description")}</p>
                  </div>
                  <Switch
                    id="require-numbers"
                    checked={securitySettings.requireNumbers}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, requireNumbers: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="require-uppercase">{t("require_uppercase")}</Label>
                    <p className="text-sm text-muted-foreground">{t("require_uppercase_description")}</p>
                  </div>
                  <Switch
                    id="require-uppercase"
                    checked={securitySettings.requireUppercase}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, requireUppercase: checked })
                    }
                  />
                </div>
              </div>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">{t("email_notifications")}</Label>
                    <p className="text-sm text-muted-foreground">{t("email_notifications_description")}</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="user-creation">{t("user_creation")}</Label>
                    <p className="text-sm text-muted-foreground">{t("user_creation_description")}</p>
                  </div>
                  <Switch
                    id="user-creation"
                    checked={notificationSettings.userCreationNotify}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, userCreationNotify: checked })
                    }
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="user-deletion">{t("user_deletion")}</Label>
                    <p className="text-sm text-muted-foreground">{t("user_deletion_description")}</p>
                  </div>
                  <Switch
                    id="user-deletion"
                    checked={notificationSettings.userDeletionNotify}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, userDeletionNotify: checked })
                    }
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="password-reset">{t("password_reset")}</Label>
                    <p className="text-sm text-muted-foreground">{t("password_reset_description")}</p>
                  </div>
                  <Switch
                    id="password-reset"
                    checked={notificationSettings.passwordResetNotify}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, passwordResetNotify: checked })
                    }
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="login-attempt">{t("login_attempt")}</Label>
                    <p className="text-sm text-muted-foreground">{t("login_attempt_description")}</p>
                  </div>
                  <Switch
                    id="login-attempt"
                    checked={notificationSettings.loginAttemptNotify}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, loginAttemptNotify: checked })
                    }
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-report">{t("weekly_report")}</Label>
                    <p className="text-sm text-muted-foreground">{t("weekly_report_description")}</p>
                  </div>
                  <Switch
                    id="weekly-report"
                    checked={notificationSettings.weeklyReportNotify}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, weeklyReportNotify: checked })
                    }
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Debug Tab */}
            <TabsContent value="debug" className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("debug_settings")}</AlertTitle>
                <AlertDescription>{t("debug_description")}</AlertDescription>
              </Alert>

              <div className="space-y-4">
                <Card className="border-dashed border-2">
                  <CardHeader>
                    <CardTitle>{t("user_sync")}</CardTitle>
                    <CardDescription>{t("user_sync_description")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{t("sync_explanation")}</p>
                    <Button onClick={handleSyncUsers} disabled={isSyncing}>
                      {isSyncing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("syncing_users")}
                        </>
                      ) : (
                        t("sync_users")
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <AuthDebugger adminId={adminId} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" className="mr-2">
            {t("reset_defaults")}
          </Button>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("saving")}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t("save_settings")}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Separator component
function Separator() {
  return <div className="my-4 h-[1px] w-full bg-border" />
}

