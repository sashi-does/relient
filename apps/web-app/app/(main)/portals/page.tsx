import PortalPlaceholder from "@/components/blocks/portal-placeholder";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";
import { connectDb, mongoose } from "@repo/db/mongoose";
import { PortalSchema } from "@repo/types/mongo-types";
import { redirect } from "next/navigation";
import { GlassTabs } from "@/components/blocks/portal-tabs";
import { Portal } from "@repo/types/interfaces";


const PortalModel = mongoose.models.Portal || mongoose.model("Portal", PortalSchema);


declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
    }
  }
}


async function getPortals(userId: string) {
  await connectDb();
  const portals = await (PortalModel as mongoose.Model<Portal>).find({ userId })
  return JSON.parse(JSON.stringify(portals));
}

export default async function Portals() {
  const session = await getServerSession(options);

  if (!session?.user?.id) {
    redirect("/dashboard")
  }

  const portals = await getPortals(session.user.id);

  if (!portals) {
    return (
      <div className="p-4 text-white">
        Failed to load portals {JSON.stringify(session?.user)}
      </div>
    );
  }

  if (portals.length === 0) {
    return <div className="h-[95vh] flex justify-center items-center">
      <PortalPlaceholder />
    </div>
  }

  return (
    <div className="text-white">
      <h1 className="text-[22px] font-bold mb-[0] p-0">Portals</h1>
      <p className="mb-3 mt-[0px] text-[#D4D4D4] p-0 text-[14px]">Create manage and host your portals</p>
      <GlassTabs portals={portals} />
      
    </div>
  );
}
