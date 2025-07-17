"use client";

import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type ProfileProps = {
  image: string;
  username: string;
};

export function Profile({ image, username }: ProfileProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto cursor-pointer p-0 hover:bg-transparent">
          <img
            className="rounded-full mr-3"
            src={image}
            alt="Profile"
            width={30}
            height={30}
            aria-hidden="true"
          />
          <span>{username}</span>
          <ChevronDown size={16} strokeWidth={2} className="ms-2 opacity-60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="bg-[#1b1b1b] min-w-[160px]">
        <DropdownMenuItem
          className="hover:bg-[#1e1e1e] hover:border-0 py-[5px] "
          onClick={() => router.push("/settings")}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem
          className="hover:bg-[#6C1818] hover:text-white text-red-500 py-[6px] text-sm"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
