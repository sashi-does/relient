import { BentoGrid } from "@/components/ui/bento-grid"
import { BentoItem } from "@repo/types/ui-types"
import {
    FolderPlus,
    Link,
    Activity,Sparkle,LayoutDashboard,CreditCard
} from "lucide-react";


const itemsSample: BentoItem[] = [
    {
      title: "Client Portals in Seconds",
      meta: "Custom-branded",
      description:
        "Set up beautiful portals for each client—no coding, no clutter. Just clean communication.",
      icon: <FolderPlus className="w-4 h-4 text-blue-500" />,
      status: "Live",
      colSpan: 2,
      hasPersistentHover: true,
    },
    {
      title: "Get Paid, Fast",
      meta: "Payment integration",
      description:
        "Send invoices and collect payments directly from your client portal. No follow-ups needed.",
      icon: <CreditCard className="w-4 h-4 text-green-500" />,
      status: "Secure",
    },
    {
      title: "No-Login Sharing",
      meta: "Just a link",
      description:
        "Clients can view updates, tasks, and progress without creating an account.",
      icon: <Link className="w-4 h-4 text-cyan-400" />,
      status: "Frictionless",
    },
    {
      title: "Progress Updates",
      meta: "Always visible",
      description:
        "Stop sending endless emails. Keep clients updated with live timelines and statuses.",
      icon: <Activity className="w-4 h-4 text-purple-500" />,
      status: "Auto-synced",
    },
    {
      title: "Modular Dashboard",
      meta: "Pick what you need",
      description:
        "Enable only the modules you use—Leads, Tasks, Appointments, Payments, and more.",
      icon: <LayoutDashboard className="w-4 h-4 text-orange-500" />,
      status: "Flexible",
    },
    {
      title: "Client-First Design",
      meta: "Clean. Clear. Fast.",
      description:
        "Your clients get a premium, mobile-ready experience that reflects your agency's brand.",
      icon: <Sparkle className="w-4 h-4 text-pink-500" />,
      status: "Branding",
    },
  ];
  

export default function Features() {
    return <>
        <h1 className="text-center my-[40px] font-medium text-5xl">Features</h1>
        <BentoGrid items={itemsSample} />
    </>

}
