'use client'

import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function PortalView() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortalDetails = async () => {
      try {
        const portalId = params?.slug;
        if (!portalId) {
          toast.error("Portal ID is missing.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`/api/portal?portalId=${portalId}`);
        if (response.data.success) {
          setData(response.data.portal);
        } else {
          toast.error(response.data.message || "Failed to fetch portal details.");
        }
      } catch (error) {
        console.error("Error fetching portal details:", error);
        toast.error("An error occurred while fetching portal details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortalDetails();
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen text-muted-foreground text-lg">
        Loading portal...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center w-full h-screen text-destructive text-lg">
        Failed to load portal.
      </div>
    );
  }

  return <Dashboard data={data} />;
}
