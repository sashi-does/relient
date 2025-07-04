import {
  Share2,
  Pencil,
  Trash2,
  Eye,
  Users,
} from "lucide-react";
import Link from "next/link";
import Radar from "@repo/ui/radar"

type CardProps = {
  type?: "portal" | "update";
  heading: string;
  count: string | number;
  subheading?: string;
  status?: string;
  progress?: number;
  lastActivity?: string;
  members?: number;
  portalId: string;
  messages?: number;
  icon?: React.ReactNode;
  growth?: string;
};

export default function Card({
  type = "update",
  heading,
  subheading,
  portalId,
  count,
  status,
  progress,
  lastActivity,
  members,
  messages,
  icon,
  growth,
}: CardProps) {
  if (type === "portal") {
    return (
      <div className="rounded-2xl p-4 bg-[#17171750] text-white shadow hover:shadow-lg transition-all w-[400px] mb-5 max-w-md border border-[#2b2b2b]">
        {/* Top Section */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-b from-[#605b5b] to-[#202020] rounded-md grid place-items-center text-white font-bold text-sm">
              {heading?.[0]}
            </div>
            <div>
              <div className="text-base font-semibold">{heading}</div>
              {subheading && (
                <div className="text-sm text-[#aaa] leading-none">{subheading}</div>
              )}
            </div>
          </div>
          <div className="flex gap-2 text-white/70">
            <Eye size={16} />
            <Link target="_blank" href={`/portal/edit/${portalId}`}>
              <Pencil size={16} />
            </Link>
            <Share2 size={16} />
            <Trash2 size={16} className="text-red-500" />
          </div>
        </div>

        {/* Status & Activity */}
        <div className="flex items-center gap-2 text-sm mb-3 text-[#b9b9b9]">
          <div
            className={`px-2 py-0.5 rounded-full text-xs ${
              status === "Active"
                ? "bg-[#1f891f30] text-green-400"
                : "bg-[#891f1f30] text-red-400"
            }`}
          >
            <Radar />
            {status}
          </div>
          <div className="opacity-70">
            Last activity:{" "}
            <span className="text-white/80">{lastActivity || "Never"}</span>
          </div>
        </div>

        {/* Progress */}
        {progress !== undefined && (
          <div className="mt-2">
            <div className="text-sm mb-1 text-[#b9b9b9]">Progress</div>
            <div className="w-full h-2 bg-[#2e2e2e] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-right text-xs text-[#999] mt-1">
              {progress}%
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between text-sm text-[#aaa] mt-4">
          <div className="flex items-center gap-1">
            <Users size={14} /> {members ?? 0} members
          </div>
          <div>{messages ?? 0} messages</div>
        </div>
      </div>
    );
  }

  // fallback to "update" card
  return (
    <div className="rounded-xl p-4 bg-[#0c0c12] text-white shadow-md w-64">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm opacity-60">{heading}</div>
          <div className="text-2xl font-semibold">{count}</div>
          {growth && <div className="text-green-400 text-xs mt-1">{growth}</div>}
        </div>
        {icon && <div className="text-blue-400">{icon}</div>}
      </div>
    </div>
  );
}
