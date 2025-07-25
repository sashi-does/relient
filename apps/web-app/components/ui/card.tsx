"use client";

import { useState } from "react";
import { Share2, Pencil, Trash2, Eye, Users, Copy } from "lucide-react";
import Link from "next/link";
import Radar from "@repo/ui/radar";
import { toast } from "sonner";
import axios from "axios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";
import Input from "@repo/ui/input";

type CardProps = {
  type?: "portal" | "update";
  heading: string;
  count?: string | number;
  subheading?: string;
  status?: string;
  progress?: number;
  lastActivity?: string;
  members?: number;
  portalId?: string;
  messages?: number;
  slug?: string;
  icon?: React.ReactNode;
  growth?: string;
};

async function deletePortal(portalId: string) {
  try {
    const response = await axios.delete("/api/portal", { data: { portalId } });
    if (response.data.status === 204) {
      toast("Portal removed successfully");
    } else {
      toast(response.data.message);
    }
  } catch (error) {
    toast((error as Error).message);
  }
}

export default function Card({
  portalId,
  slug,
  type = "portal",
  heading,
  subheading,
  status,
  lastActivity,
  members,
  messages,
}: CardProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  console.log("SSSSS" + slug);
  const shareUrl = slug ? `https://relient.in/${slug}` : null;

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast("Copied to clipboard");
    }
  };

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
            <DropdownMenuContent className="bg-[#1b1b1b]">
              <DropdownMenuItem className="hover:bg-[#1e1e1e] py-[5px] mt-1">
                <Link
                  className="flex items-center"
                  href={`/portal/view/${portalId}`}
                  target="_blank"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View</span>
                </Link>
              </DropdownMenuItem>
              <Link target="_blank" href={`/portal/edit/${portalId}`}>
                <DropdownMenuItem className="hover:bg-[#1e1e1e] py-[5px]">
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => setShareDialogOpen(true)}
                className="hover:bg-[#1e1e1e] py-[5px]"
              >
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deletePortal(portalId as string)}
                className="hover:bg-[#6C1818] hover:text-white py-[5px] mb-1 text-red-500 focus:text-white"
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
            <span className="text-white/80">{lastActivity || "Never"}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between text-sm text-[#aaa] mt-4">
          <div className="flex items-center gap-1">
            <Users size={14} /> {members ?? 0} members
          </div>
          <div>{messages ?? 0} messages</div>
        </div>

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent>
            <DialogTitle>Share Portal</DialogTitle>
            <DialogDescription>
              Share this link with your client to view the portal.
            </DialogDescription>

            {shareUrl ? (
              <div className="mt-4 flex items-center gap-2">
                <Input readOnly value={shareUrl} />
                <Button size="icon" variant="outline" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="mt-4 text-sm text-red-400">
                No shareable link available. Please create a portal first.
              </div>
            )}

            <DialogFooter className="mt-4">
              <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4 bg-[#0c0c12] text-white shadow-md w-64">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm opacity-60">{heading}</div>
          </div>
      </div>
    </div>
  );
}
