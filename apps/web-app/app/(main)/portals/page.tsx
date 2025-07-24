import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";
import { connectDb, mongoose } from "@repo/db/mongoose";
import { PortalSchema } from "@repo/types/mongo-types";
import { redirect } from "next/navigation";
import ClientPortalPage from "./ClientPortalPage";
import { Portal } from "@repo/types/interfaces";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
    }
  }
}


const PortalModel = mongoose.models.Portal || mongoose.model("Portal", PortalSchema);

async function getPortals(userId: string) {
  await connectDb();
  const portals = await (PortalModel as mongoose.Model<Portal>).find({ userId });
  return JSON.parse(JSON.stringify(portals));
}

export default async function Portals() {
  const session = await getServerSession(options);

  if (!session?.user?.id) {
    redirect("/dashboard");
  }

  const portals = await getPortals(session.user.id);

  return <ClientPortalPage />;
}
