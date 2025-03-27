"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { hashPassword } from "@/lib/auth-utils"

interface AdminProfileProps {
  adminData: {
    id: string
    name: string
  }
}

export function AdminProfile({ adminData }: AdminProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: adminData.name,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const { t, dir } = useLanguage()
  const router = useRouter()

  const handleSave = () => {
    // In a real app, this would be an API call to update the admin profile
    setIsEditing(false)

    // Show success message (in a real app)
    alert("Profile updated successfully!")
  }

  const handlePasswordChange = (e) => {
    const { id, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handlePasswordSubmit = () => {
    setPasswordError("")
    setIsChangingPassword(true)

    // Validate passwords
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("All fields are required")
      setIsChangingPassword(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match")
      setIsChangingPassword(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long")
      setIsChangingPassword(false)
      return
    }

    // Get current admin data from localStorage
    try {
      const adminAuthString = localStorage.getItem("adminAuth")
      if (!adminAuthString) {
        setPasswordError("Authentication data not found. Please log in again.")
        setIsChangingPassword(false)
        return
      }

      const adminAuth = JSON.parse(adminAuthString)

      // In a real app, we would verify the current password against a hashed version
      // For this demo, we'll simulate password verification
      // Normally we'd have the password hash stored, but for demo we'll accept admin ID as password
      const isCurrentPasswordValid =
        passwordData.currentPassword === adminAuth.id || passwordData.currentPassword === "1" // For test admin

      if (!isCurrentPasswordValid) {
        setPasswordError("Current password is incorrect")
        setIsChangingPassword(false)
        return
      }

      // Generate a new token to invalidate old sessions
      const newToken = "admin-token-" + Math.random().toString(36).substring(2)

      // Update admin auth data with new token
      const updatedAuth = {
        ...adminAuth,
        token: newToken,
        passwordLastChanged: new Date().toISOString(),
        // In a real app, we would store a password hash, not the password itself
        passwordHash: hashPassword(passwordData.newPassword),
      }

      // Save updated auth data
      localStorage.setItem("adminAuth", JSON.stringify(updatedAuth))

      // Success - close dialog and reset form
      setIsChangingPassword(false)
      setIsPasswordDialogOpen(false)

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      // Show success message
      toast({
        title: "Password Changed",
        description:
          "Your admin password has been updated successfully. You'll need to use your new password for future logins.",
        duration: 5000,
      })

      // Force logout after a short delay to ensure the user uses the new password
      setTimeout(() => {
        toast({
          title: "Session Expired",
          description: "Please log in again with your new password.",
          duration: 5000,
        })

        // Clear auth data and redirect to login
        localStorage.removeItem("adminAuth")
        router.push("/")
      }, 5000)
    } catch (error) {
      console.error("Error changing password:", error)
      setPasswordError("An error occurred while changing your password. Please try again.")
      setIsChangingPassword(false)
    }
  }

  const getPasswordLastChangedText = () => {
    try {
      const adminAuthString = localStorage.getItem("adminAuth")
      if (!adminAuthString) return "Last changed unknown"

      const adminAuth = JSON.parse(adminAuthString)
      if (!adminAuth.passwordLastChanged) return "Last changed unknown"

      // Format the date
      const lastChanged = new Date(adminAuth.passwordLastChanged)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return "Changed today"
      if (diffDays === 1) return "Changed yesterday"
      return `Last changed ${diffDays} days ago`
    } catch (error) {
      return "Last changed unknown"
    }
  }

  useEffect(() => {
    // Check if admin auth data exists and is valid
    try {
      const adminAuthString = localStorage.getItem("adminAuth")
      if (!adminAuthString) {
        router.push("/")
        return
      }

      const adminAuth = JSON.parse(adminAuthString)
      if (!adminAuth.isLoggedIn || !adminAuth.token) {
        router.push("/")
      }
    } catch (error) {
      console.error("Error checking admin auth:", error)
      router.push("/")
    }
  }, [router])

  return (
    <Card className="admin-profile-container max-w-4xl mx-auto">
      <CardHeader className="admin-profile-header">
        <CardTitle>{t("admin_profile")}</CardTitle>
        <CardDescription>{t("manage_account_settings")}</CardDescription>
      </CardHeader>
      <CardContent className="admin-profile-content space-y-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <ShieldCheck className="h-10 w-10 text-blue-600 rtl-ignore" />
          </div>
          <div className="space-y-1 text-center sm:text-start">
            <h3 className="text-xl font-semibold">{adminData.name}</h3>
            <p className="text-sm text-muted-foreground">
              {t("admin_id")}: {adminData.id}
            </p>
            <div className="admin-profile-actions flex justify-center space-x-2 sm:justify-start">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? t("cancel") : t("edit_profile")}
              </Button>
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">{t("name")}</Label>
              <Input
                id="admin-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current-password">{t("current_password")}</Label>
              <Input
                id="current-password"
                type="password"
                placeholder={t("enter_current_password")}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">{t("new_password")}</Label>
              <Input
                id="new-password"
                type="password"
                placeholder={t("enter_new_password")}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t("confirm_new_password")}</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder={t("confirm_new_password")}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
            <Button onClick={handleSave}>{t("save_changes")}</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="admin-profile-grid grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t("name")}</div>
                <div>{formData.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t("admin_id")}</div>
                <div>{adminData.id}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t("role")}</div>
                <div>{t("administrator")}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("security")}</h4>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <div className="font-medium">{t("password")}</div>
                  <div className="text-sm text-muted-foreground">{getPasswordLastChangedText()}</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsPasswordDialogOpen(true)}>
                  {t("change")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("change_admin_password")}</DialogTitle>
            <DialogDescription>{t("enter_current_and_new_password")}</DialogDescription>
          </DialogHeader>

          {passwordError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 rtl-ignore" />
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}

          <div className="dialog-grid grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentPassword" className="dialog-label text-right">
                {t("current_password")}
              </Label>
              <Input
                id="currentPassword"
                type="password"
                className="col-span-3"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPassword" className="dialog-label text-right">
                {t("new_password")}
              </Label>
              <Input
                id="newPassword"
                type="password"
                className="col-span-3"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmPassword" className="dialog-label text-right">
                {t("confirm_password")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                className="col-span-3"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>
          </div>

          <DialogFooter className="dialog-footer">
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handlePasswordSubmit} disabled={isChangingPassword}>
              {isChangingPassword ? t("changing") : t("change_password")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

