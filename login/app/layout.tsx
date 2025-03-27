import type { ReactNode } from "react"
import { LanguageProvider } from "@/lib/language-context"
import { RTLLayoutProvider } from "@/components/rtl-layout-provider"
import "./globals.css"

export const metadata = {
  title: "Admin & User Login System",
  description: "A secure login system with admin and user roles",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <RTLLayoutProvider>{children}</RTLLayoutProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}



import './globals.css'