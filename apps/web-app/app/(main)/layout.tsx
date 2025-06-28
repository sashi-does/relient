// app/layout.tsx or components/Layout.tsx

import Sidebar from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      {/* bg-[#101011] */}

      <div className="flex-1 overflow-y-auto text-white p-6 md:ml-[260px]">
      {children}
      </div>

    </div>
  )
}
