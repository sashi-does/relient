'use client'

import PortalPlaceholder from "@/components/blocks/portal-placeholder";
import Card from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Portals() {
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPortals() {
      try {
        const response = await axios.get("/api/portal");
        const data = response.data.portals; 
        setPortals(data);
      } catch (err) {
        setError("Failed to fetch portals");
        console.error("Error fetching portals:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPortals();
  }, []);

  if (loading) {
    return <PortalPlaceholder />;
  }

  if (error) {
    return <div className="p-4 text-white">{error}</div>;
  }

  if (portals.length === 0) {
    return <PortalPlaceholder />;
  }

  return (
    <div className="space-y-4 p-4 flex justify-center items-center h-[90vh] text-white">
      {portals.map((p) => (
        <Card
          key={p._id.$oid} // Use MongoDB _id as the key
          type="portal"
          heading={p.portalName}
          subheading={p.clientName}
          status={p.status}
          progress={0} // Not provided in backend, set to 0 or calculate if needed
          lastActivity={p.lastVisited ? `Last visited: ${new Date(p.lastVisited.$date).toLocaleString()}` : "Never"}
          members={0} // Not provided, set to 0 or fetch if needed
          messages={p.inbox || 0} // Map inbox to messages
        />
      ))}
    </div>
  );
}