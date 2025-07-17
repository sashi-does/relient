"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { ContextProvider } from "../context/dialogContext";
import { Profile } from "@/components/ui/profile";
import axios from "axios";
import Loader from "@repo/ui/loader";

const Sidebar = dynamic(() => import("@/components/ui/sidebar"), {
  ssr: false,
});

function InnerLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: session, status } = useSession();
  const createPortalTriggerRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const router = useRouter();


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

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (status !== "authenticated") {
      setIsLoading(false);
      return;
    }

    const checkOnboarding = async () => {
      try {
        console.log(`${process.env.NEXTAUTH_URL}/api/onboard`);
        const response = await axios.get(`/api/onboard/status`);
        if (!response.data.success) {
          console.warn("User not authenticated or error:");
          setIsLoading(false);
          return;
        }

        if (!response.data.status) {
          router.replace("/user/onboarding");
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to check onboarding:", err);
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, [status, router]);


  if (isLoading) {
    return (
      <Loader heightInVp={100}/>
    );
  }


  return (
    <ContextProvider value={{ dialogOpen, setDialogOpen: (open: boolean) => { setDialogOpen(open); return open; } }}>
      <div className="flex h-screen">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <div
          className={`flex-1 bg-[#0F0F0F] overflow-y-auto text-white pl-[40px] pt-[25px] pr-[20px] transition-all duration-300 ${
            isCollapsed ? "ml-[64px]" : "ml-[240px]"
          }`}
        >
          <div className="flex justify-end">
            <Profile
              image={(session?.user as { image?: string })?.image || ""}
              username={(session?.user as { name?: string })?.name || ""}
            />
          </div>

          {children}
        </div>
      </div>
    </ContextProvider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <InnerLayout>{children}</InnerLayout>
    </SessionProvider>
  );
}