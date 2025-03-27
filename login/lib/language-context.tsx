"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { translations } from "./translations"

// Define available languages and their properties
export const languages = {
  en: { name: "English", dir: "ltr", flag: "🇺🇸" },
  ar: { name: "العربية", dir: "rtl", flag: "🇸🇦" },
  fr: { name: "Français", dir: "ltr", flag: "🇫🇷" },
}

export type LanguageCode = keyof typeof languages

// Define the context type
type LanguageContextType = {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: string) => string
  dir: "ltr" | "rtl"
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Create the provider component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en")
  const [isClient, setIsClient] = useState(false)

  // Function to set language and store preference
  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)

    // Store language preference in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLanguage", lang)

      // Set dir attribute on document for RTL support
      document.documentElement.dir = languages[lang].dir
      document.documentElement.lang = lang
    }
  }

  // Translation function
  const t = (key: string): string => {
    return translations[language]?.[key] || key // Fallback to key if translation missing
  }

  // Detect user's preferred language on initial load
  useEffect(() => {
    setIsClient(true)

    // Check localStorage first
    const storedLanguage = localStorage.getItem("preferredLanguage") as LanguageCode

    if (storedLanguage && languages[storedLanguage]) {
      setLanguage(storedLanguage)
    } else {
      // Detect from browser
      const browserLang = navigator.language.split("-")[0] as LanguageCode

      // Use detected language if supported, otherwise default to English
      if (languages[browserLang]) {
        setLanguage(browserLang)
      } else {
        setLanguage("en")
      }
    }

    // Set initial direction
    document.documentElement.dir = languages[language].dir
    document.documentElement.lang = language
  }, [])

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    dir: languages[language].dir,
  }

  // Only render children when we're in the browser
  if (!isClient) {
    return null
  }

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

