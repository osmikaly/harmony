"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/lib/language-context"
import { hashPassword } from "@/lib/password-utils"

export default function AdminLoginForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    adminId: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id === "admin-id" ? "adminId" : "password"]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Check for test admin credentials (ID: 1, Password: 1)
      if (formData.adminId === "1" && formData.password === "1") {
        // Store admin info in localStorage
        localStorage.setItem(
          "adminAuth",
          JSON.stringify({
            id: "1",
            name: "Test Admin",
            isLoggedIn: true,
            token: "test-token-" + Math.random().toString(36).substring(2),
            passwordLastChanged: new Date().toISOString(),
            passwordHash: hashPassword(formData.password),
          }),
        )

        // Redirect to admin dashboard
        router.push("/admin/dashboard")
        return
      }

      // For demo purposes, also allow any other credentials
      await new Promise((resolve) => setTimeout(resolve, 1000))

      localStorage.setItem(
        "adminAuth",
        JSON.stringify({
          id: formData.adminId,
          name: `Admin ${formData.adminId}`,
          isLoggedIn: true,
          token: "demo-token-" + Math.random().toString(36).substring(2),
          passwordLastChanged: new Date().toISOString(),
          passwordHash: hashPassword(formData.password),
        }),
      )

      // Redirect to admin dashboard
      router.push("/admin/dashboard")
    } catch (err) {
      setError("Authentication failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <div className="rounded-full bg-blue-100 p-3">
          <ShieldCheck className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold">{t("admin_login_title")}</h3>
        <p className="text-sm text-muted-foreground">{t("admin_login_description")}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-id">{t("admin_id")}</Label>
          <Input
            id="admin-id"
            type="text"
            placeholder={t("enter_admin_id")}
            required
            value={formData.adminId}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">{t("password")}</Label>
          <Input id="admin-password" type="password" required value={formData.password} onChange={handleChange} />
        </div>
        <div className="flex items-center">
          <Label className="flex items-center gap-2 text-sm">
            <Input type="checkbox" className="h-4 w-4" />
            {t("remember_me")}
          </Label>
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
          {isLoading ? t("logging_in") : t("login_as_admin")}
        </Button>
      </form>
    </div>
  )
}

