"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { DialogContext } from "@/app/context/dialogContext";
import { Profile } from "@/components/ui/profile";
import { Menu } from "lucide-react";
import { DialogContextProps } from "@/app/context/dialogContext";
import clsx from "clsx";
import axios from "axios";
import Loader from "@repo/ui/loader";

const Sidebar = dynamic(() => import("@/components/ui/sidebar"), {
  ssr: false,
});

function InnerLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: session, status } = useSession();
  const createPortalTriggerRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<DialogContextProps["user"]>(null);
  const [portals, setPortals] = useState<DialogContextProps["portals"]>([])

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "p") {
        event.preventDefault();
        createPortalTriggerRef.current?.click();
      }

      if ((event.metaKey || event.ctrlKey) && event.key === "b") {
        event.preventDefault();
        if (window.innerWidth < 768) {
          setIsSidebarOpen((prev) => !prev);
          if (!isSidebarOpen) {
            setIsCollapsed(false);
          }
        } else {
          setIsCollapsed((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
        setIsSidebarOpen(false);
      } else {
        setIsCollapsed(false);
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  // fetch user and agency
  useEffect(() => {
    const fetchUserAndAgency = async () => {
      try {
        if (!session?.user?.id) return;
  
        const response = await axios.get(`/api/user?userId=${session.user.id}`);
        console.log(JSON.stringify(response.data))
        if (response.data.success === true) {
          setUser(response.data.user);
        } else {
          console.error("User fetch failed:", response.data.message);
        }
      } catch (e) {
        console.error("API Error:", e);
      }
    };
  
    if (status === "authenticated") {
      fetchUserAndAgency();
    }
  }, [status, session?.user?.id]);

  useEffect(() => {
    const getPortals = async () => {
      
      const response = await axios.get(`/api/portal/all?userId=${session?.user?.id}`)
      console.log(response.data.portals)
      if(response.data.success) {
        setPortals(response.data.portals)
      }
    }
    if(status === "authenticated") {
      getPortals()
    }
  }, [status, session?.user?.id])
  

  if (isLoading) {
    return <Loader heightInVp={100} />;
  }

  return (
    <DialogContext.Provider value={{ user, portals }}>
      <div className="flex h-screen">
        <button
          className={clsx(
            "md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#171717] text-white transition-opacity",
            {
              "opacity-0 pointer-events-none": isSidebarOpen,
            }
          )}
          onClick={() => {
            setIsSidebarOpen(true);
            setIsCollapsed(false);
          }}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          createPortalTriggerRef={
            createPortalTriggerRef as React.RefObject<HTMLDivElement>
          }
        />

        <div
          className={clsx(
            "flex-1 bg-[#0F0F0F] overflow-y-auto text-white pl-[40px] pt-[25px] pr-[20px] transition-all duration-300",
            {
              "ml-0": window.innerWidth < 768,
              "ml-[64px]": window.innerWidth >= 768 && isCollapsed,
              "ml-[240px]": window.innerWidth >= 768 && !isCollapsed,
              "blur-sm": isSidebarOpen && window.innerWidth < 768,
            }
          )}
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
    </DialogContext.Provider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <InnerLayout>{children}</InnerLayout>
    </SessionProvider>
  );
}
