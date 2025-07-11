'use client'

import { useEffect, useState } from 'react'
import Image from "next/image"

type Placeholder = {
  heading: string
  paragraph: string
  image: string
}

export default function GenericPlaceholder({heading, paragraph, image}: Placeholder) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="p-5 flex flex-col justify-center h-[70vh] gap-y-3">
      <Image
        draggable={false}
        className="ml-[-15px]"
        src={image}
        width={130}
        height={130}
        alt="portal"
      />
      <h1>{heading}</h1>
      <p className="text-[#5B5B5D] text-[14px]">
        {paragraph}
      </p>
    </div>
  )
}