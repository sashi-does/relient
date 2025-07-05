'use client'

import { Share2, Pencil, Trash2, Eye, Users } from "lucide-react";
import Link from "next/link";
import Radar from "@repo/ui/radar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import axios from "axios";

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

async function deletePortal(portalId: string) {
  try {

    const response = await axios.delete('/api/portal', { data : { portalId } })
    if(response.data.status == 204) {
      toast("Portal removed successfully")
    }
    else {
      toast(response.data.message)
    }
  } catch (error) {
    toast((error as Error).message);
  }
}

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
                <div className="text-sm text-[#aaa] leading-none">
                  {subheading}
                </div>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-white/70 hover:text-white transition-colors hover:cursor-pointer focus:outline-none">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6h.01M12 12h.01M12 18h.01"
                  />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#2e2e2e]">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                <span>View</span>
              </DropdownMenuItem>
              <Link target="_blank" href={`/portal/edit/${portalId}`}>
                <DropdownMenuItem className="hover:bg-[#3b3b3b] focus:bg-[#3b3b3b] text-white/70 hover:text-white focus:text-white">
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="hover:bg-[#3b3b3b] focus:bg-[#3b3b3b] text-white/70 hover:text-white focus:text-white">
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deletePortal(portalId)}
                className="hover:bg-[#3b3b3b] focus:bg-[#3b3b3b] text-red-500 hover:text-red-400 focus:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          {growth && (
            <div className="text-green-400 text-xs mt-1">{growth}</div>
          )}
        </div>
        {icon && <div className="text-blue-400">{icon}</div>}
      </div>
    </div>
  );
}
