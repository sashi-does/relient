import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import ClientPortalPage from "./ClientPortalPage";


declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
    }
  }
}


export default async function Portals() {
  const session = await getServerSession(options);

  if (!session?.user?.id) {
    redirect("/dashboard");
  }


  return <ClientPortalPage />;
}
