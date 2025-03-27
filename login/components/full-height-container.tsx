"use client"

import { type ReactNode, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface FullHeightContainerProps {
  children: ReactNode
  className?: string
  minHeight?: boolean
  centerContent?: boolean
}

export function FullHeightContainer({
  children,
  className,
  minHeight = true,
  centerContent = false,
}: FullHeightContainerProps) {
  const [viewportHeight, setViewportHeight] = useState<number | null>(null)

  // Update viewport height on resize and initial load
  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight)
    }

    // Set initial height
    updateHeight()

    // Add event listener for resize
    window.addEventListener("resize", updateHeight)

    // Clean up
    return () => window.removeEventListener("resize", updateHeight)
  }, [])

  return (
    <div
      className={cn(
        "w-full bg-background",
        minHeight && "min-h-screen",
        viewportHeight && `h-[${viewportHeight}px]`,
        centerContent && "flex items-center justify-center",
        className,
      )}
      style={viewportHeight ? { height: `${viewportHeight}px` } : {}}
    >
      {children}
    </div>
  )
}

