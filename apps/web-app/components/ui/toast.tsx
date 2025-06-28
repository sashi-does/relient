"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@repo/ui/utils"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "success" | "error"
  onClose?: () => void
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.()
    }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-96 rounded-lg border p-4 shadow-lg",
        variant === "success" && "bg-green-900 border-green-700 text-green-100",
        variant === "error" && "bg-red-900 border-red-700 text-red-100",
        variant === "default" && "bg-gray-900 border-gray-700 text-gray-100",
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          {title && <div className="font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        <button onClick={onClose} className="opacity-70 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const ToastViewport = () => {
  return null
}

export const ToastTitle = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const ToastDescription = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const ToastClose = () => {
  return null
}

export const ToastAction = () => {
  return null
}
