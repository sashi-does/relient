import { Globe, Users, IndentIncrease } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";

const detailConfig = {
  portals: {
    title: "Total Portals",
    icon: Globe,
  },
  activeStatus: {
    title: "Active / Inactive",
    icon: Users,
  },
  progress: {
    title: "Average Progress",
    icon: IndentIncrease,
  },
};

export default function Stats({ type }: { type: keyof typeof detailConfig }) {
  const [portals, setPortals] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPortals() {
      try {
        const res = await axios.get(`/api/portal`);
        setPortals(res.data.portals || []);
      } catch (err) {
        console.error("Failed to fetch portals", err);
      }
    }

    fetchPortals();
  }, []);

  const Icon = detailConfig[type].icon;

  // Derive values from portals
  let value = "-";

  if (type === "portals") {
    value = String(portals.length);
  }

  if (type === "activeStatus") {
    const active = portals.filter((p) => p.status === "active").length;
    const inactive = portals.length - active;
    value = `${active} / ${inactive}`;
  }

  if (type === "progress") {
    const totalProgress = portals.reduce((sum, p) => sum + (p.progress || 0), 0);
    const avgProgress = portals.length ? (totalProgress / portals.length).toFixed(0) : "0";
    value = `${avgProgress}%`;
  }

  return (
    <div className="md:w-[20vw] w-[80vw] my-5 p-6 pb-10 hover:border-[#ffffff44] hover:cursor-pointer rounded-2xl border border-muted bg-background shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{detailConfig[type].title}</p>
          <p className="text-2xl my-2 font-extrabold text-white">{value}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-black via-zinc-800 to-gray-800 text-white p-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
