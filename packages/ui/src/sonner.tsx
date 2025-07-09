"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import type { ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
    theme={theme as ToasterProps["theme"]}
    className="toaster group !z-[9999]" // higher z-index
    style={{
      position: 'fixed', // ensure it's not relative
      "--normal-bg": "var(--popover)",
      "--normal-text": "var(--popover-foreground)",
      "--normal-border": "var(--border)",
    } as React.CSSProperties}
    {...props}
    />
  )
}

export { Toaster }
