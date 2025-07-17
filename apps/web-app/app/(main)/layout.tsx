"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { SessionProvider, useSession } from "next-auth/react";
import { ContextProvider } from "../context/dialogContext";
import { Profile } from "@/components/ui/profile";

const Sidebar = dynamic(() => import("@/components/ui/sidebar"), {
  ssr: false,
});

function InnerLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const session = useSession();
  const createPortalTriggerRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "p") {
        event.preventDefault();
        createPortalTriggerRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ContextProvider.Provider value={{ dialogOpen, setDialogOpen: (open: boolean) => { setDialogOpen(open); return open; } }}>
      <div className="flex h-screen">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <div
          className={`flex-1 bg-[#0F0F0F] overflow-y-auto text-white pl-[40px] pt-[25px] pr-[20px] transition-all duration-300 ${
            isCollapsed ? "ml-[64px]" : "ml-[240px]"
          }`}
        >
          <div className="flex justify-end">
            <Profile
              image={(session.data?.user as { image?: string })?.image || ""}
              username={(session.data?.user as { name?: string })?.name || ""}
            />
          </div>

          {children}
        </div>
      </div>
    </ContextProvider.Provider>
  );
}

// ✅ Wrap with SessionProvider here
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <InnerLayout>{children}</InnerLayout>
    </SessionProvider>
  );
}
