import { Button } from "@repo/ui/button";
import Image from "next/image";

export default function PortalPlaceholder() {
  return (
    <div className="p-5 w-[400px] flex flex-col gap-y-3">
      <Image draggable={false}
         className="ml-[-15px]" src={'/portal.png'} width={130} height={130} alt="portal" />
      <h1>Portals</h1>
      <p className="text-[#5B5B5D] text-[14px]">
        Create portals for your clients and track their analytics in real time.
        By monitoring key metrics, you gain valuable insights into performance,
        helping you and your clients make data-driven decisions to improve and
        grow effectively.
      </p>
      <Button variant="default" className="w-fit primary rounded-md">Create new portal</Button>
    </div>
  );
}
