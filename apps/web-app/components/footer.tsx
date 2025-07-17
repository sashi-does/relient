'use client'

import { Sparkles } from "@repo/ui/sparkles"
import { useTheme } from "next-themes"

export default function Footer() {
  const { theme } = useTheme()
  return (
    <div className="h-[450px] w-full overflow-hidden">
      <div className="mx-auto mt-32 w-full max-w-2xl">
      </div>

      <div className="relative -mt-32 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]">
        <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#008BDF70,transparent_70%)] before:opacity-40" />
        <div className="absolute -left-1/2 top-1/2 aspect-[1/0.7] z-10 w-[200%] rounded-[100%] border-t border-zinc-900/20 dark:border-white/20 bg-white dark:bg-zinc-900" />
        <Sparkles
          density={1200}
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
          color={theme === "dark" ? "#ffffff" : "#000000"}
        />
        <h1 className="relative text-[100px] -bottom-24 sm:text-[150px] sm:-bottom-11 md:bottom-2 text-[#cbcbcb] md:text-[200px] text-gray text-center">Relient</h1>
      </div>
    </div>
  )
}


