"use client";

import { Portal } from "@repo/types/interfaces";
import PortalPlaceholder from "@/components/blocks/portal-placeholder";
import { GlassTabs } from "@/components/blocks/portal-tabs";
import { useContext } from "react";
import { DialogContext } from "@/app/context/dialogContext";

export default function ClientPortalPage() {
  const { portals } = useContext(DialogContext)
  // console.log(JSON.stringify(portals) + "******")
  if (!portals || portals.length === 0) {
    return (
      <div className="h-[95vh] flex justify-center items-center">
        <PortalPlaceholder />
      </div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="text-[22px] font-bold mb-[0] p-0">Portals</h1>
      <p className="mb-3 mt-[0px] text-[#D4D4D4] p-0 text-[14px]">
        Create, manage and host your portals
      </p>
      <GlassTabs portals={portals} />
    </div>
  );
}
