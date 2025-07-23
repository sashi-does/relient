"use client";

import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Settings,
  CreditCard,
  Plus,
  Command,
  Copyright,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
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
} from "@repo/ui/dialog";
import axios from "axios";
import { Button } from "@repo/ui/button";
import Loader from "@repo/ui/loader";
import { toast } from "sonner";
import { Toaster } from "@repo/ui/sonner";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@repo/ui/tooltip";

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
  isSidebarOpen,
  setIsSidebarOpen,
  createPortalTriggerRef,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  createPortalTriggerRef: React.RefObject<HTMLDivElement>;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const portalNameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const mailRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();

  async function createPortal(
    portalName: string,
    name: string,
    mail: string,
    description: string
  ) {
    setLoading(true);
    try {
      const res = await axios.post("/api/portal", {
        portalName,
        name,
        mail,
        description,
      });
      if (res.data.success) {
        setDialogOpen(false);
        setIsSidebarOpen(false);
        toast("Portal Created Successfully");
        location.reload();
        redirect("/portals");
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      console.error("Error creating portal:", error);
    }
    setLoading(false);
  }

  return (
    <>
      <Toaster />

      <div
        className={clsx(
          "fixed top-0 left-0 h-[100vh] text-white bg-[#171717] border-r border-zinc-800 px-3 z-50 transition-all duration-300 ease-in-out flex flex-col justify-between overflow-y-auto",
          {
            "w-[280px] md:w-[245px]": !isCollapsed && isSidebarOpen,
            "w-[64px]": isCollapsed && isSidebarOpen, 
            "translate-x-0": isSidebarOpen, 
            "-translate-x-full": !isSidebarOpen,
          }
        )}
      >
        <div>
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="flex items-center">
              <Image
                src="/relient.png"
                alt="Relient Logo"
                width={28}
                height={28}
                className="invert brightness-0 opacity-80"
              />
              {!isCollapsed && (
                <span className="font-extrabold text-2xl ml-2 logo">Relient</span>
              )}
            </div>

            {isSidebarOpen && window.innerWidth < 768 && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-md hover:bg-[#40404080] transition"
                aria-label="Close sidebar"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
          {!isCollapsed && (
            <span className="text-[10px] text-[#757474] flex justify-center items-center mt-2">
              <Copyright className="mr-1" height={10} width={10} /> 2025
              relient.in, Inc beta
            </span>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <div
                ref={createPortalTriggerRef}
                className="hover:bg-[#4f4f4f23] transition-all duration-200 rounded-4xl flex items-center justify-center w-full mb-6 mt-6"
              >
                <LiquidButton
                  variant="default"
                  className="w-full p-2 flex justify-center"
                >
                  {isCollapsed ? (
                    <Plus className="h-4 w-4" />
                  ) : (
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
                <DialogTitle className="text-white">
                  Create Client Portal
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-y-5">
                <div className="flex flex-col gap-y-3 w-full">
                  <span className="text-gray-400">Portal Name</span>
                  <Input
                    className="text-white py-2"
                    ref={portalNameRef}
                    placeholder="e.g: Project Alpha"
                  />
                </div>
                <div className="flex flex-col gap-y-3 w-full">
                  <span className="text-gray-400">Client Name</span>
                  <Input
                    className="text-white py-2"
                    ref={nameRef}
                    placeholder="e.g: Cal.com"
                  />
                </div>
                <div className="flex flex-col gap-y-3 w-full">
                  <span className="text-gray-400">Client Email</span>
                  <Input
                    className="text-white py-2"
                    ref={mailRef}
                    placeholder="e.g: hello@cal.com"
                  />
                </div>
                <div className="flex flex-col gap-y-3 w-full">
                  <span className="text-gray-400">Project Description</span>
                  <Textarea
                    className="text-white py-2"
                    ref={descRef}
                    placeholder="e.g: Plan strategy"
                  />
                </div>
                <Button
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
                  {loading ? <Loader heightInVp={100} /> : "Create"}
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
                    onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)} 
                    className={clsx(
                      "flex items-center gap-3 px-3 py-[6px] font-medium text-[#b9b9b9] text-[20px] rounded-md transition group relative",
                      {
                        "bg-[#404040]": isActive,
                        "text-white": isActive,
                        "hover:bg-[#262626]": true,
                        "justify-center": isCollapsed,
                      }
                    )}
                  >
                    {isCollapsed && (
                      <Tooltip>
                        <TooltipTrigger className="cursor-pointer">
                          <item.icon className="!w-[16px] !h-[16px]" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <span className="text-[15px]">{item.name}</span>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {!isCollapsed && (
                      <>
                        <item.icon className="!w-[16px] !h-[16px]" />
                        <span className="text-[15px]">{item.name}</span>
                      </>
                    )}
                    {isCollapsed && (
                      <span className="absolute left-[70px] bg-zinc-900 px-2 py-1 rounded shadow text-xs opacity-0 group-hover:opacity-100 text-[red] transition whitespace-nowrap z-10">
                        {item.name}
                      </span>
                    )}
                    {!isCollapsed && item.count !== undefined && (
                      <span className="ml-auto text-sm text-[#FAFAFA]">
                        {item.count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {!isCollapsed && <SubscriptionCard />}
        {window.innerWidth >= 768 && (
          <button
            className={clsx(
              "mb-4 p-2 rounded-md cursor-pointer hover:bg-[#40404080] transition self-end"
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle sidebar collapse"
          >
            <Image
              className={`invert brightness-[0.7] contrast-[2.85] ${
                isCollapsed ? "rotate-180" : "rotate-0"
              }`}
              src="/collapse.png"
              height={20}
              width={20}
              alt="collapse"
            />
          </button>
        )}
      </div>

      {isSidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}
    </>
  );
}