import PortalPlaceholder from "@/components/blocks/portal-placeholder";
import Card from "@/components/ui/card";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";
import { connectDb, mongoose } from "@repo/db/mongoose";
import { PortalSchema } from "@repo/types/mongo-types";
import { GlassTabs } from "@/components/blocks/portal-tabs";

const Portal =
  mongoose.models.Portal || mongoose.model("Portal", PortalSchema);

async function getPortals(userId: string) {
  await connectDb();
  const portals = await Portal.find({ userId }).lean();
  return JSON.parse(JSON.stringify(portals));
}

export default async function Portals() {
  const session = await getServerSession(options);

  if (!session?.user?.id) {
    return <div className="p-4 text-white">Not logged in</div>;
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
      <PortalPlaceholder />;
    </div>
  }

  return (
    <div className="h-[100vh] text-white">
      <h1 className="text-xl font-bold mb-5">Portals</h1>
      <GlassTabs portals={portals} />
      
    </div>
  );
}
