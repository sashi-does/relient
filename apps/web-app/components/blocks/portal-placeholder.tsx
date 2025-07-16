"use client";

import { Button } from "@repo/ui/button";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/dialog";
import Input from "@repo/ui/input";
import { Textarea } from "@repo/ui/text-area";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "@repo/ui/sonner";
import Loader from "@repo/ui/loader";
import { redirect } from "next/navigation";

export default function PortalPlaceholder() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const portalNameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const mailRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);

  async function createPortal(
    portalName: string,
    name: string,
    mail: string,
    description: string
  ) {
    setLoading(true);
    try {
      const res = await axios.post("/api/portal", {
        portalName,
        name,
        mail,
        description,
      });
      if (res.data.success) {
        setDialogOpen(false);
        toast("Portal Created Successfully");
        location.reload();
        redirect("/portals");
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      console.error("Error creating portal:", error);
    }
    setLoading(false);
  }

  return (
    <>
      <Toaster />
      <div className="p-5 w-[400px] flex flex-col gap-y-3">
        <Image
          draggable={false}
          className="ml-[-15px]"
          src={"/portal.png"}
          width={130}
          height={130}
          alt="portal"
        />
        <h1>Portals</h1>
        <p className="text-[#5B5B5D] text-[14px]">
          Create portals for your clients to share updates, collect feedback, and
          manage project details in one place. Deliver a professional experience
          while tracking performance and staying aligned.
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="mt-5 w-fit primary rounded-md">
              Create new portal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-white">
                Create Client Portal
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-y-5">
              <div className="flex flex-col gap-y-3 w-full">
                <span className="text-gray-400">Portal Name</span>
                <Input
                  className="text-white py-2"
                  ref={portalNameRef}
                  placeholder="e.g: Project Alpha"
                />
              </div>
              <div className="flex flex-col gap-y-3 w-full">
                <span className="text-gray-400">Client Name</span>
                <Input
                  className="text-white py-2"
                  ref={nameRef}
                  placeholder="e.g: Cal.com"
                />
              </div>
              <div className="flex flex-col gap-y-3 w-full">
                <span className="text-gray-400">Client Email</span>
                <Input
                  className="text-white py-2"
                  ref={mailRef}
                  placeholder="e.g: hello@cal.com"
                />
              </div>
              <div className="flex flex-col gap-y-3 w-full">
                <span className="text-gray-4
00">Project Description</span>
                <Textarea
                  className="text-white py-2"
                  ref={descRef}
                  placeholder="e.g: Plan strategy"
                />
              </div>
              <Button
                onClick={() =>
                  createPortal(
                    portalNameRef.current?.value ?? "",
                    nameRef.current?.value ?? "",
                    mailRef.current?.value ?? "",
                    descRef.current?.value ?? ""
                  )
                }
                disabled={loading}
              >
                {loading ? <Loader heightInVp={100}/> : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}