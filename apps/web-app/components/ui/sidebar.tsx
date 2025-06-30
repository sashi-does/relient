"use client";

import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Settings,
  CreditCard,
  X,
  Plus,
  Command,
  ChevronRight,
} from "lucide-react";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import clsx from "clsx";
import SubscriptionCard from "./subscription-card";
import Input from "@repo/ui/input";
import { Textarea } from "@repo/ui/text-area";
import { LiquidButton } from "./liquid-glass-button";
import {
  Dialog,
  DialogContent,
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

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const portalNameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const mailRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);
  const [loading, isLoading] = useState(false);

  const pathname = usePathname();

  // Automatically collapse sidebar on small devices and handle Cmd + B, Cmd + P, and Cmd + K shortcuts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setIsCollapsed(true);
        setIsOpen(false);
      } else {
        setIsCollapsed(false);
        setIsOpen(true);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        if (event.key === "b" || event.key === "B") {
          event.preventDefault();
          console.log("Cmd + B triggered");
          if (window.innerWidth < 768) {
            setIsOpen((prev) => !prev);
          } else {
            setIsCollapsed((prev) => !prev);
          }
        } else if (event.key === "p" || event.key === "P") {
          event.preventDefault();
          console.log(`Cmd + ${event.key.toUpperCase()} triggered`);
          setDialogOpen(true);
          if (dialogTriggerRef.current) {
            dialogTriggerRef.current.click(); 
          }
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setIsCollapsed]);

  async function createPortal(portalName: string, name: string, mail: string, description: string) {
    isLoading(true);
    try {
      const res = await axios.post("/api/portal", {
        portalName,
        name,
        mail,
        description,
      });
      setDialogOpen(false);
      toast("Portal Created Successfully");
      redirect('/portals')
      window.refresh()

      
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
        {isOpen ? <X className="w-5 h-5 text-white" /> : <ChevronRight className="w-5 h-5 text-white" />}
      </button>

      <button
        className={clsx(
          "hidden md:block fixed top-5 z-[60] bg-zinc-900 p-1 rounded hover:bg-zinc-800 transition",
          isCollapsed ? "left-[64px]" : "left-[260px]"
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <X size={16} />}
      </button>

      <div
        className={clsx(
          "fixed top-0 mt-5 mb-5 left-0 h-screen text-white border-r border-zinc-800 px-3 z-50 transition-all duration-300 ease-in-out bg-black flex flex-col justify-between",
          {
            "w-[260px]": !isCollapsed,
            "w-[64px]": isCollapsed,
            "translate-x-0": isOpen || !isCollapsed,
            "-translate-x-full md:translate-x-0": !isOpen,
          }
        )}
      >
        <div>
          <div className="flex items-center justify-center mt-4 mb-6">
            <Image
              src="/relient.png"
              alt="Relient Logo"
              width={28}
              height={28}
              className="invert brightness-0 opacity-80"
            />
            {!isCollapsed && <span className="font-extrabold text-2xl ml-2 logo">Relient</span>}
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <div className="group cursor-pointer flex items-center justify-center w-full px-2 mb-6">
                <LiquidButton ref={dialogTriggerRef} variant="default" className="w-full p-2 flex justify-center">
                  {isCollapsed ? <Plus className="h-4 w-4" /> : (
                    <div className="flex flex-row items-center justify-between w-full px-2">
                      <span className="mr-3">Create Portal</span>
                      <span className="flex items-center gap-1 px-2 py-1 text-xs font-mono text-[#D1D1D1] bg-[#1C1C1E] rounded-md group-hover:bg-[#2A2A2C]">
                        <Command className="h-3 w-3" />p
                      </span>
                    </div>
                  )}
                </LiquidButton>
              </div>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Client Portal</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-y-5">
                <div className="flex flex-col gap-y-3 w-full">
                  <span>Portal Name</span>
                  <Input className="py-2" ref={portalNameRef} placeholder="e.g: Project Alpha" />
                </div>
                <div className="flex flex-col gap-y-3 w-full">
                  <span>Client Name</span>
                  <Input className="py-2" ref={nameRef} placeholder="e.g: Cal.com" />
                </div>
                <div className="flex flex-col gap-y-3 w-full">
                  <span>Client Email</span>
                  <Input className="py-2" ref={mailRef} placeholder="e.g: hello@cal.com" />
                </div>
                <div className="flex flex-col gap-y-3 w-full">
                  <span>Project Description</span>
                  <Textarea className="py-2" ref={descRef} placeholder="e.g: Plan strategy" />
                </div>
                <Button
                  className="bg-white text-black hover:bg-[#ffffffc9]"
                  onClick={() =>
                    createPortal(
                      portalNameRef.current?.value ?? "",
                      nameRef.current?.value ?? "",
                      mailRef.current?.value ?? "",
                      descRef.current?.value ?? ""
                    )
                  }
                  disabled={loading}
                >
                  {loading ? <Loader /> : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <ul className="space-y-1">
            {menuItems.map((item, idx) => {
              const isActive = pathname === item.href;

              return (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-[8px] rounded-md transition group relative",
                      {
                        "bg-zinc-900": isActive,
                        "hover:bg-zinc-900": true,
                        "justify-center": isCollapsed,
                      }
                    )}
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    {!isCollapsed && <span className="text-[15px]">{item.name}</span>}
                    {isCollapsed && (
                      <span className="absolute left-[70px] bg-zinc-900 px-2 py-1 rounded shadow text-xs opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                        {item.name}
                      </span>
                    )}
                    {!isCollapsed && item.count !== undefined && (
                      <span className="ml-auto text-sm text-zinc-400">{item.count}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {!isCollapsed && <SubscriptionCard />}
      </div>
    </>
  );
}