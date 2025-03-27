"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserRound, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { loginUser, setCurrentUser, debugInspectUsers, User } from "@/lib/auth-utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { useLanguage } from "@/lib/language-context"

export default function UserLoginForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  })
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id === "user-id" ? "userId" : "password"]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setShowDebugInfo(false)
    setDebugInfo(null)

    try {
      // Log the attempt for debugging
      console.log(`Attempting login with ID: ${formData.userId}`)

      // Debug: Inspect current users in storage
      const currentUsers = await debugInspectUsers()
      console.log(`Found ${currentUsers.length} users in storage`)

      // Check if user exists before attempting login
      const userExists = currentUsers.some((u: User) => u.id.toLowerCase() === formData.userId.toLowerCase())

      if (!userExists) {
        setError("User ID not found. Please check your credentials or register a new account.")
        setDebugInfo({
          usersInSystem: currentUsers.length,
          userIdsInSystem: currentUsers.map((u: User) => u.id),
          attemptedUserId: formData.userId,
        })
        setShowDebugInfo(true)
        setIsLoading(false)
        return
      }

      // Attempt to login
      const user = await loginUser(formData.userId, formData.password)

      if (user) {
        console.log("Login successful:", user.id)

        // Store user auth in localStorage
        setCurrentUser(user)

        // Redirect to group-pilgrim-connect-main project
        window.location.href = `http://${window.location.hostname}:3003`
      } else {
        console.log("Login failed: Invalid credentials")

        // Since we already checked that the user exists, this must be a password issue
        setError("Invalid password. Please try again.")
        setDebugInfo({
          userFound: true,
          passwordVerificationFailed: true,
          attemptedUserId: formData.userId,
        })
        setShowDebugInfo(true)
      }
    } catch (err: unknown) {
      console.error("Login error:", err)
      setError("Authentication failed. Please check your credentials.")
      setDebugInfo({
        error: err instanceof Error ? err.message : "Unknown error",
      })
      setShowDebugInfo(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <div className="rounded-full bg-green-100 p-3">
          <UserRound className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold">{t("user_login_title")}</h3>
        <p className="text-sm text-muted-foreground">{t("user_login_description")}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showDebugInfo && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Authentication Debug Info</AlertTitle>
          <AlertDescription className="text-blue-700 text-xs">
            <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user-id">{t("user_id")}</Label>
          <Input
            id="user-id"
            type="text"
            placeholder={t("enter_user_id")}
            required
            value={formData.userId}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-password">{t("password")}</Label>
          <Input id="user-password" type="password" required value={formData.password} onChange={handleChange} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-sm">
            <Input type="checkbox" className="h-4 w-4" />
            {t("remember_me")}
          </Label>
          <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
            <DialogTrigger asChild>
              <Button variant="link" className="p-0 text-sm text-primary">
                {t("forgot_password")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogDescription>Enter your user ID and we'll help you reset your password.</DialogDescription>
              </DialogHeader>
              <ForgotPasswordForm onSuccess={() => setIsForgotPasswordOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
          {isLoading ? t("logging_in") : t("login_as_user")}
        </Button>
      </form>

      <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
        <p className="text-sm text-blue-800">
          <strong>{t("test_credentials")}:</strong> {t("try_logging_in")}
        </p>
        <ul className="text-xs text-blue-700 mt-1 list-disc pl-4">
          <li>
            {t("user_id")}: <strong>user1</strong>, {t("password")}: <strong>password123</strong>
          </li>
          <li>
            {t("user_id")}: <strong>demo</strong>, {t("password")}: <strong>demo123</strong>
          </li>
        </ul>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">{t("account_creation_restricted")}</p>
        <p className="text-xs text-muted-foreground mt-1">{t("contact_admin_for_account")}</p>
      </div>
    </div>
  )
}

