import { Globe, Users, IndentIncrease } from "lucide-react";


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

export default function Stats({ type, count }: { type: keyof typeof detailConfig, count?: number}) {

  const Icon = detailConfig[type].icon;


  return (
  <div className="md:w-[32vw] w-[80vw] my-5 p-6 pb-10 hover:border-[#ffffff44] hover:cursor-pointer rounded-2xl border border-muted bg-[#121212] shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{detailConfig[type].title}</p>
          <p className="text-2xl my-2 font-extrabold text-white">
            {type === "portals" && count} 
            {type === "activeStatus" && `0 / ${count}`}
            {type === "progress" && `0%`}
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-black via-zinc-800 to-gray-800 text-white p-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
