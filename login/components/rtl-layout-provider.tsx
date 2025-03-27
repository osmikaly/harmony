"use client"

import { type ReactNode, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"

interface RTLLayoutProviderProps {
  children: ReactNode
}

export function RTLLayoutProvider({ children }: RTLLayoutProviderProps) {
  const { dir } = useLanguage()

  useEffect(() => {
    // Apply RTL class to body when direction is RTL
    if (dir === "rtl") {
      document.body.classList.add("rtl-layout")
    } else {
      document.body.classList.remove("rtl-layout")
    }

    // Set dir attribute on html element
    document.documentElement.setAttribute("dir", dir)

    return () => {
      document.body.classList.remove("rtl-layout")
    }
  }, [dir])

  return <>{children}</>
}

