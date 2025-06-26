// app/layout.tsx or components/Layout.tsx

import Sidebar from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 overflow-y-auto bg-black text-white p-6 md:ml-[300px]">

        {/* {children} */}
      </div>
    </div>
  )
}
