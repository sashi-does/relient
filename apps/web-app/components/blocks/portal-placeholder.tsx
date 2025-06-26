import { Button } from "@repo/ui/button";
import Image from "next/image";

export default function PortalPlaceholder() {
  return (
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
      <Button variant="default" className="mt-5 w-fit primary rounded-md">
        Create new portal
      </Button>
    </div>
  );
}
