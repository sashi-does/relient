'use client' // Add this directive

import { useEffect, useState } from 'react'

export default function Payments() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div>
      Payments
    </div>
  )
}