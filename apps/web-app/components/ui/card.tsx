import {
  Share2,
  Pencil,
  Trash2,
  Eye,
  Users,
} from "lucide-react";
import Link from "next/link";

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
      <div className="rounded-xl p-4 bg-[#0c0c12] text-white shadow-md w-full max-w-md">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md grid place-items-center font-bold">
                {heading[0]}
              </div>
              <div>
                <div className="font-semibold">{heading}</div>
                {subheading && <div className="text-sm opacity-70">{subheading}</div>}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <div className={`${status === "Active" ? "bg-green-700" : "bg-red-800"} text-xs px-2 py-0.5 rounded-full`}
              >
                {status}
              </div>
              <div className="opacity-60">Last activity: {lastActivity}</div>
            </div>
          </div>
          <div className="flex gap-2 mt-1">
            <Eye size={16} />
            <Link target="_blank" href={`/portal/edit/${portalId}`}><Pencil size={16} /></Link>
            <Share2 size={16} />
            <Trash2 size={16} />
          </div>
        </div>

        {progress !== undefined && (
          <div className="mt-4">
            <div className="text-sm mb-1">Progress</div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-right text-xs mt-1">{progress}%</div>
          </div>
        )}

        <div className="flex justify-between text-sm opacity-80 mt-3">
          <div className="flex items-center gap-1">
            <Users size={14} /> {members} members
          </div>
          <div>{messages} messages</div>
        </div>
      </div>
    );
  }


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
