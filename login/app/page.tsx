"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { UserRound, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import AdminLoginForm from "@/components/admin-login-form"
import UserLoginForm from "@/components/user-login-form"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loginType, setLoginType] = useState<"none" | "admin" | "user">("none")
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false)
  const { t, dir } = useLanguage()

  useEffect(() => {
    // Check if user just registered
    const registered = searchParams.get("registered")
    if (registered === "true") {
      setShowRegistrationSuccess(true)

      // Clear success message after 5 seconds
      const timer = setTimeout(() => {
        setShowRegistrationSuccess(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4" dir={dir}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-end w-full">
            <LanguageSwitcher />
          </div>
          <CardTitle className="text-2xl">{t("welcome")}</CardTitle>
          <CardDescription>{t("choose_login_type")}</CardDescription>
        </CardHeader>
        <CardContent>
          {showRegistrationSuccess && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{t("registration_successful")}</AlertDescription>
            </Alert>
          )}

          {loginType === "none" && (
            <div className="grid gap-4">
              <Button
                variant="outline"
                className="h-16 border-2 border-blue-500 hover:bg-blue-50"
                onClick={() => setLoginType("admin")}
              >
                <ShieldCheck className="mr-2 h-5 w-5 text-blue-500" />
                <span className="text-lg font-medium">{t("admin_login")}</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 border-2 border-green-500 hover:bg-green-50"
                onClick={() => setLoginType("user")}
              >
                <UserRound className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-lg font-medium">{t("user_login")}</span>
              </Button>
            </div>
          )}

          {loginType === "admin" && (
            <>
              <Button variant="ghost" className="mb-4" onClick={() => setLoginType("none")}>
                {t("back_to_selection")}
              </Button>
              <AdminLoginForm />
            </>
          )}

          {loginType === "user" && (
            <>
              <Button variant="ghost" className="mb-4" onClick={() => setLoginType("none")}>
                {t("back_to_selection")}
              </Button>
              <UserLoginForm />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

