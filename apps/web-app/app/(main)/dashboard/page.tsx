import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";
import Greeting from "@repo/ui/greet";
import { redirect } from "next/navigation";
import GenericPlaceholder from "@/components/blocks/generic-placeholder";

const features = [
  {
    title: "Branded Portals",
    description: "Create beautiful client portals with your agency's branding.",
    icon: "🌐",
  },
  {
    title: "Client Updates",
    description: "Share timelines, progress, and files — no login needed.",
    icon: "📝",
  },
  {
    title: "Lead Tracking",
    description: "Organize and share real-time lead updates in each portal.",
    icon: "📊",
  },
  {
    title: "Task Visibility",
    description: "Keep clients informed with transparent project tasks.",
    icon: "✅",
  },
  {
    title: "Secure Payments",
    description: "Collect one-time or recurring payments inside each portal.",
    icon: "💰",
  },
  {
    title: "Module Control",
    description: "Choose which modules (Tasks, Leads, Appointments) are visible.",
    icon: "⚙️",
  },
];

export default async function Dashboard() {
  const session = await getServerSession(options);
  const user = session?.user;
  if (!user) redirect("/");

  return (
    <div className="space-y-4 p-4">
      <Greeting name={(user as { name: string }).name as string} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 shadow-sm"
        >
          <div className="text-2xl mb-2">{feature.icon}</div>
          <h3 className="text-white font-semibold text-lg">{feature.title}</h3>
          <p className="text-zinc-400 text-sm mt-1">{feature.description}</p>
        </div>
      ))}
    </div>
    </div>
  );
}
