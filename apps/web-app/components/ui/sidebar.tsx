'use client'

import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Settings,
  CreditCard,
  Menu,
  X,
} from "lucide-react"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import SubscriptionCard from "./subscription-card"
import Input from "@repo/ui/input"
import { Textarea } from "@repo/ui/text-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axios from "axios"
import { Button } from "@repo/ui/button"



const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Inbox", icon: Inbox, href: "/inbox", count: 128 },
  { name: "Portals", icon: FolderKanban, href: "/portals" },
  { name: "Settings", icon: Settings, href: "/settings" },
  { name: "Payments", icon: CreditCard, href: "/payments" },
]

async function createPortal(name: string, mail: string, description: string) {
  try {
    const res = await axios.post("/api/portal/create", { name, mail, description });
    // toast("Portal Created Successfully");
    console.log(res.data);
  } catch (error) {
    console.error("Error creating portal:", error);
    // toast("Failed to create portal");
  }
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null);
  const mailRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname()

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-[100] bg-zinc-900 p-2 rounded hover:bg-zinc-800 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>


      <div
        className={clsx(
          "fixed top-0 mt-5 mb-5 left-0 h-screen w-[260px] text-white border-r border-zinc-800 px-4 z-50 transition-transform duration-300 ease-in-out bg-black flex flex-col justify-between",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
            "md:translate-x-0": true,
          }
        )}
      >
        <div>

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
        
        <Dialog>
          <DialogTrigger className="w-full bg-white cursor-pointer text-black py-1 hover:bg-[#ffffffc9] rounded-md mb-4">Create Portal +</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Client Portal</DialogTitle>
              <DialogDescription></DialogDescription>
              <div className="flex flex-col gap-y-5">
                <div className="flex flex-col gap-y-3 w-[100%]">
                  <span>Client Name</span>
                  <Input className="py-2" ref={nameRef} placeholder="e.g: Cal.com" />
                </div>
                <div className="flex flex-col gap-y-3 w-[100%]">
                  <span>Client Email</span>
                  <Input className="py-2" ref={mailRef} placeholder="e.g: hello@cal.com" />
                </div>

                <div className="w-[100%] gap-y-3 flex flex-col justify-center">
                  <span>Project Description</span>
                  <Textarea className="py-2" ref={descRef} placeholder="e.g: Plan strategy" />
                </div>
                <Button
                  className="bg-white text-black cursor-pointer hover:bg-[#ffffffc9]"
                  onClick={() =>
                    createPortal(
                      nameRef.current?.value as string,
                      mailRef.current?.value as string,
                      descRef.current?.value as string
                    )
                  }
                >
                  Create
                </Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>

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


        <SubscriptionCard />
      </div>
    </>
  )
}
