"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Input from "@repo/ui/input";
import { SessionProvider, useSession } from "next-auth/react";
import { Textarea } from "@repo/ui/text-area";
import { Button } from "@repo/ui/button";
import { Trash2Icon } from "lucide-react";

export default function Settings() {
  return (
    <SessionProvider>
      <Page />
    </SessionProvider>
  );
}

function Page() {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");

  useEffect(() => {
    setIsMounted(true);
    if (session?.user?.image) setProfilePic(session.user.image);
    if (session?.user?.name) setUsername(session.user.name);
    if (session?.user?.email) setEmail(session.user.email);
  }, [session]);

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure? Account deletion cannot be undone.")) {
      alert("Account deletion initiated");
    }
  };


  if (!isMounted || !session) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-sm">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="text-gray-300 p-6">
      <div className="mx-auto px-[30px] py-[30px] border-1 w-[50vw] rounded-xl flex flex-col justify-center items-center">
        <h1 className="text-xl self-start font-bold mb-3 text-white">Profile</h1>
        <p className="text-sm mb-6 w-fit self-start text-gray-200">Manage profile settings</p>

        <div className="w-full">
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <Image
                src={profilePic}
                alt="Profile"
                width={60}
                height={60}
                className="rounded-full border border-gray-700"
                unoptimized
              />
            
              <div className="flex flex-col">
                <span className="text-sm font-semibold mb-2 text-gray-200">Profile Picture</span>
                <div>
                <label className="bg-transparent cursor-pointer border border-[#ffffff50] px-[8px] py-[5px] text-[14px] rounded-md">
                  Upload Avatar
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePicUpload}
                  />
                </label>
                <button
                  className="bg-[#6c1818] hover:bg-[#5e1414] cursor-pointer border border-[#470e0e] px-[8px] ml-2 py-[3px] text-[14px] rounded-md"
                  onClick={() => setProfilePic("/default-avatar.png")}
                >
                  Remove
                </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-400">Username</label>
            <Input
              type="text"
              className="py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="cal.com/ sashi-giffo"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: You can add a "+" between usernames: cal.com/anna+brian to make a dynamic group meeting
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-400">Email</label>
            <div className="flex items-center gap-2">
              <Input
                className="py-2 cursor-not-allowed disabled"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
              
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-400">About</label>
            <Textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full h-24"
            />
          </div>

          <Button >Update</Button>

          <div className="mt-6 p-4 flex flex-col items-start border border-gray rounded-md">
            <h2 className="text-red-400 font-semibold mb-2">Danger zone</h2>
            <p className="text-sm text-gray-500">Be careful! Account deletion cannot be undone.</p>
            <Button
              className="mb-3 flex items-center justify-between gap-x-1 self-end mt-5 border-1 border-[#ffffff50] bg-transparent px-3 py-[5px] roudnded text-white hover:bg-[#6c1818] hover:text-white"
              onClick={handleDeleteAccount}
            >
              <Trash2Icon height={15} width={15} />
              Delete account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
