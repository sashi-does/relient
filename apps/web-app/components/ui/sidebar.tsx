'use client'

import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Settings,
  CreditCard,
  Menu,
  X,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import DemoOne from "./subscription-card"

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Inbox", icon: Inbox, href: "/inbox", count: 128 },
  { name: "Portals", icon: FolderKanban, href: "/portals" },
  { name: "Settings", icon: Settings, href: "/settings" },
  { name: "Payments", icon: CreditCard, href: "/payments" },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Toggle Button (mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-[100] bg-zinc-900 p-2 rounded hover:bg-zinc-800 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed top-0 mt-5 mb-5 left-0 h-screen w-[300px] text-white border-r border-zinc-800 px-4 z-50 transition-transform duration-300 ease-in-out bg-black flex flex-col justify-between",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
            "md:translate-x-0": true,
          }
        )}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-6 mt-2">
          <Image
            src="/relient.png"
            alt="Relient Logo"
            width={28}
            height={28}
            className="brightness-0 mt-1 invert mix-blend-screen opacity-80"
          />
          <span className="font-extrabold text-2xl logo">Relient</span>
        </div>

          {/* Menu Items */}
          <ul className="space-y-1">
            {menuItems.map((item, idx) => {
              const isActive = pathname === item.href

              return (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex justify-between items-center px-3 py-[8px] rounded-md transition",
                      {
                        "bg-zinc-900": isActive,
                        "hover:bg-zinc-900": true,
                      }
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-[16px] h-[16px]" />
                      <span className="text-[15px]">{item.name}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className="text-sm text-zinc-400">{item.count}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* CTA: Upgrade Plan */}
        <DemoOne />
      </div>
    </>
  )
}
