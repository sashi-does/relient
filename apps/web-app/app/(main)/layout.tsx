// app/layout.tsx or components/Layout.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const createPortalTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && (event.key === "p")) {
        event.preventDefault();
        createPortalTriggerRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div
        className={`flex-1 overflow-y-auto text-white p-4 transition-all duration-300 ${
          isCollapsed ? "ml-[64px]" : "ml-[260px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
