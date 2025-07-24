"use client";

import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import Input from "@repo/ui/input";
import { SessionProvider, useSession } from "next-auth/react";
import { Textarea } from "@repo/ui/text-area";
import { Button } from "@repo/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { PanelsTopLeft, Trash2Icon, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip";
import { DialogContext } from "@/app/context/dialogContext";



export default function Settings() {
  return (
    <SessionProvider>
      <Page />
    </SessionProvider>
  );
}

function Page() {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(true);
  const { user } = useContext(DialogContext);
  const [profilePic, setProfilePic] = useState(user?.image);

  console.log("####--->");
  console.log("User from context:", user);
  console.log("####--->");
  const [username, setUsername] = useState(user?.username);
  const [industry, setIndustry] = useState(user?.agency.industry);
  const [email, setEmail] = useState(user?.email);
  const [about, setAbout] = useState("");
  const agencyData = {
    agencyName: user?.agency.agencyName as string,
    website: user?.agency.website as string,
    industry: user?.agency.industry as string,
    teamSize: user?.agency.teamSize as number,
  };

  function TabComponent() {
    return (
      <Tabs
        defaultValue="tab-1"
        orientation="vertical"
        className="flex flex-row mx-auto w-[50vw] items-start justify-center gap-2"
      >
        <TabsList className="flex-col mt-2 justify-start w-fit">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <TabsTrigger value="tab-1" className="py-3 cursor-pointer">
                    <User size={16} strokeWidth={2} aria-hidden="true" />
                  </TabsTrigger>
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="px-2 py-1 text-xs">
                Profile
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <TabsTrigger
                    value="tab-2"
                    className="cursor-pointer group py-3"
                  >
                    <span className="relative">
                      <PanelsTopLeft
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </span>
                  </TabsTrigger>
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="px-2 py-1 text-xs">
                Agency
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TabsList>
        <div className="grow rounded-lg text-start">
          <TabsContent value="tab-1" className="w-[50vw]">
            <div className="mx-auto px-[30px] py-[30px] border-1 rounded-xl flex flex-col justify-center items-center">
              <h1 className="text-xl self-start font-bold mb-3 text-white">
                Profile
              </h1>
              <p className="text-sm mb-6 w-fit self-start text-gray-200">
                Manage profile settings
              </p>

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
                      <span className="text-sm font-semibold mb-2 text-gray-200">
                        Profile Picture
                      </span>
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
                  <label className="block text-sm font-medium mb-1 text-gray-400">
                    Username
                  </label>
                  <Input
                    type="text"
                    className="py-2"
                    value={username as string}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="cal.com/ sashi-giffo"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: You can add a `+` between usernames: cal.com/anna+brian
                    to make a dynamic group meeting
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-400">
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      className="py-2 cursor-not-allowed disabled"
                      type="email"
                      value={email as string}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1 text-gray-400">
                    About
                  </label>
                  <Textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full h-24"
                  />
                </div>

                <Button>Update</Button>

                <div className="mt-6 p-4 flex flex-col items-start border border-gray rounded-md">
                  <h2 className="text-red-400 font-semibold mb-2">
                    Danger zone
                  </h2>
                  <p className="text-sm text-gray-500">
                    Be careful! Account deletion cannot be undone.
                  </p>
                  <Button
                    className="mb-3 flex items-center justify-between gap-x-1 self-end mt-5 border-1 border-[#ffffff50] bg-transparent px-3 py-[3px] roudnded text-white hover:bg-[#6c1818] hover:border-[#6c1818] hover:text-white"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2Icon height={15} width={15} />
                    Delete account
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="tab-2" className="w-[50vw]">
            <div className="mx-auto px-[30px] py-[30px] border-1 rounded-xl flex flex-col justify-center items-center">
              <h1 className="text-xl self-start font-bold mb-3 text-white">
                Agency Profile
              </h1>
              <p className="text-sm mb-6 w-fit self-start text-gray-200">
                Manage Agency profile settings
              </p>

              <div className="w-full">
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <Image
                      src={profilePic}
                      alt="AgencyProfile"
                      width={60}
                      height={60}
                      className="rounded-full border border-gray-700"
                      unoptimized
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold mb-2 text-gray-200">
                        Agency Logo
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-400">
                    Agency Name
                  </label>
                  <Input
                    type="text"
                    className="py-2"
                    value={agencyData?.agencyName || ""}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-400">
                    Website
                  </label>
                  <Input
                    type="text"
                    className="py-2"
                    value={agencyData?.website || ""}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-400">
                    Industry
                  </label>

                  <Select
                    value={agencyData?.industry}
                    onValueChange={setIndustry}
                  >
                    <SelectTrigger className="py-2">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REALESTATE">Real Estate</SelectItem>
                      <SelectItem value="LAWYERS">Lawyers</SelectItem>
                      <SelectItem value="B2B">B2B</SelectItem>
                      <SelectItem value="AUTOMOTIVE">Automotive</SelectItem>
                      <SelectItem value="ECOM">E-commerce</SelectItem>
                      <SelectItem value="MEDICAL">Medical</SelectItem>
                      <SelectItem value="HOME_SERVICES">
                        Home Services
                      </SelectItem>
                      <SelectItem value="COACHING_CONSULTING">
                        Coaching & Consulting
                      </SelectItem>
                      <SelectItem value="SOLAR">Solar</SelectItem>
                      <SelectItem value="INSURANCE">Insurance</SelectItem>
                      <SelectItem value="FINANCE">Finance</SelectItem>
                      <SelectItem value="STAFFING">Staffing</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1 text-gray-400">
                    Team Size
                  </label>
                  <Input
                    type="number"
                    className="py-2"
                    value={agencyData?.teamSize?.toString() || ""}
                  />
                </div>
              </div>
              <div className="w-full">
                <Button className="mr-0">Update</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="tab-3">
            <p className="px-4 py-1.5 text-xs text-muted-foreground">
              Content for Tab 3
            </p>
          </TabsContent>
        </div>
      </Tabs>
    );
  }

  if (!session?.user) {
    // router.replace("/")
  }

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
    <div className="text-gray-300 flex flex-row justify-center p-6">
      <TabComponent />
    </div>
  );
}
