"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <ShieldAlert className="h-6 w-6 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold">{t("registration_not_available")}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">{t("registration_restricted_message")}</p>
          <p className="text-sm text-muted-foreground">{t("contact_admin_for_account")}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/")}>{t("return_to_login")}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

