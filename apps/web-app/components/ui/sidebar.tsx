"use client";

import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Settings,
  CreditCard,
  Menu,
  X,
} from "lucide-react";

import { useRef } from "react";
import { Command } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { redirect, usePathname } from "next/navigation";
import clsx from "clsx";
import SubscriptionCard from "./subscription-card";
import Input from "@repo/ui/input";
import { Textarea } from "@repo/ui/text-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { Button } from "@repo/ui/button";
import Loader from "@repo/ui/loader";
import { toast } from "sonner";
import { Toaster } from "@repo/ui/sonner";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Inbox", icon: Inbox, href: "/inbox", count: 128 },
  { name: "Portals", icon: FolderKanban, href: "/portals" },
  { name: "Settings", icon: Settings, href: "/settings" },
  { name: "Payments", icon: CreditCard, href: "/payments" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // Controls sidebar visibility
  const [dialogOpen, setDialogOpen] = useState(false); // Controls Dialog visibility
  const portalNameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const mailRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const [loading, isLoading] = useState(false);

  const pathname = usePathname();

  async function createPortal(
    portalName: string,
    name: string,
    mail: string,
    description: string
  ) {
    isLoading(true);
    try {
      const res = await axios.post("/api/portal", {
        portalName,
        name,
        mail,
        description,
      });
      console.log(res.data);
      setDialogOpen(false); // Close the Dialog after success
      toast("Portal Created Successfully");
    } catch (error) {
      console.error("Error creating portal:", error);
    }
    isLoading(false);
  }

  return (
    <>
      <Toaster />
      <button
        className="md:hidden fixed top-4 left-4 z-[100] bg-zinc-900 p-2 rounded hover:bg-zinc-800 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
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

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger className="group cursor-pointer flex items-center justify-between w-full px-4 py-2 rounded-lg bg-[#023734af] hover:bg-[#4A4A4D] text-white font-medium transition-all duration-200 shadow-md mb-6">
              <span className="text-sm">Create Portal</span>
              <span className="flex items-center gap-1 px-2 py-1 text-xs font-mono text-[#D1D1D1] bg-[#1C1C1E] rounded-md group-hover:bg-[#2A2A2C]">
                <Command className="h-3 w-3" />p
              </span>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Client Portal</DialogTitle>
                <DialogDescription></DialogDescription>
                <div className="flex flex-col gap-y-5">
                  <div className="flex flex-col gap-y-3 w-[100%]">
                    <span>Portal Name</span>
                    <Input
                      className="py-2"
                      ref={portalNameRef}
                      placeholder="e.g: Project Alpha"
                    />
                  </div>
                  <div className="flex flex-col gap-y-3 w-[100%]">
                    <span>Client Name</span>
                    <Input
                      className="py-2"
                      ref={nameRef}
                      placeholder="e.g: Cal.com"
                    />
                  </div>
                  <div className="flex flex-col gap-y-3 w-[100%]">
                    <span>Client Email</span>
                    <Input
                      className="py-2"
                      ref={mailRef}
                      placeholder="e.g: hello@cal.com"
                    />
                  </div>
                  <div className="w-[100%] gap-y-3 flex flex-col justify-center">
                    <span>Project Description</span>
                    <Textarea
                      className="py-2"
                      ref={descRef}
                      placeholder="e.g: Plan strategy"
                    />
                  </div>
                  <Button
                    className="bg-white text-black cursor-pointer hover:bg-[#ffffffc9]"
                    onClick={() =>
                      createPortal(
                        portalNameRef.current?.value as string,
                        nameRef.current?.value as string,
                        mailRef.current?.value as string,
                        descRef.current?.value as string
                      )
                    }
                  >
                    {loading ? <Loader /> : "Create"}
                  </Button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* Menu Items */}
          <ul className="space-y-1">
            {menuItems.map((item, idx) => {
              const isActive = pathname === item.href;

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
                      <span className="text-sm text-zinc-400">
                        {item.count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <SubscriptionCard />
      </div>
    </>
  );
}