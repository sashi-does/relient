import PortalPlaceholder from "@/components/blocks/portal-placeholder";
import Card from "@/components/ui/card";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";

async function getPortals() {
  try {
    const response = await fetch(`http:localhost:3000/api/portal`, {
      credentials: 'include' // or 'force-cache' if you want to cache
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch portals');
    }
    
    const data = await response.json();
    console.log(data)
    return data.portals;
  } catch (error) {
    console.error("Error fetching portals:", error);
    return null;
  }
}

export default async function Portals() {
  const portals = await getPortals();
  const session = await getServerSession(options)
  console.log(session)

  if (!portals) {
    return <div className="p-4 text-white">Failed to load portals {JSON.stringify(session?.user)}</div>;
  }

  if (portals.length === 0) {
    return <PortalPlaceholder />;
  }

  return (
    <div className="space-y-4 p-4 flex justify-center items-center h-[90vh] text-white">
      {portals.map((p) => (
        <Card
          key={p._id.$oid}
          type="portal"
          heading={p.portalName}
          subheading={p.clientName}
          status={p.status}
          progress={0}
          lastActivity={p.lastVisited ? `Last visited: ${new Date(p.lastVisited.$date).toLocaleString()}` : "Never"}
          members={0}
          messages={p.inbox || 0}
        />
      ))}
      <sonner />
    </div>
  );
}