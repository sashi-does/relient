

import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";
import Greeting from "@repo/ui/greet";
import { redirect } from "next/navigation";
import Card from "@/components/ui/card";
import { Users } from "lucide-react";

export default async function Dashboard() {
  const session = await getServerSession(options);
  const user = session?.user;
  if (!user) redirect("/");

  return (
    <div className="space-y-4 p-4">
      <Greeting name={(user as {name: string}).name as string} />
      

    </div>
  );
}
