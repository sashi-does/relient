'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { Loader2, Users, CheckSquare, BarChart3 } from "lucide-react";

interface Portal {
  _id: string;
  portalName: string;
  clientName: string;
  clientEmail: string;
  projectDescription: string;
  status: string;
  createdAt: string;
  lastVisited: string;
  modules: {
    overview?: { title: string; summary: string };
    tasks?: { tasks: { title: string; completed: boolean }[] };
    leads?: { leads: { name: string; email: string }[] };
  };
}

const PortalView: React.FC<{ portalId: string }> = ({ portalId }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [portal, setPortal] = useState<Portal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortal = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`/api/portal`, { portalId });

        if (response.data.success) {
          setPortal(response.data.portal);
        } else {
          setError(response.data.message || "Failed to fetch portal data");
        }
      } catch (err) {
        setError("Failed to fetch portal data");
        console.error("Error fetching portal:", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && portalId) {
      fetchPortal();
    }
  }, [portalId, status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <Loader2 className="w-8 h-8 animate-spin" aria-hidden="true" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        You don't have access
      </div>
    );
  }

  if (error || !portal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        {error || "Portal not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{portal.portalName}</h1>
        <p className="text-gray-300 text-sm sm:text-base mt-1">Client Portal</p>
      </header>

      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-white text-lg sm:text-xl">Portal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-300">Client Name</p>
            <p className="text-white font-medium">{portal.clientName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-300">Client Email</p>
            <p className="text-white font-medium">{portal.clientEmail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-300">Project Description</p>
            <p className="text-white font-medium">{portal.projectDescription}</p>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-300">Status</p>
              <Badge
                className={`${
                  portal.status === "Active"
                    ? "bg-green-900 text-green-200 border-green-800"
                    : "bg-gray-800 text-gray-300 border-gray-700"
                }`}
              >
                {portal.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-300">Created At</p>
              <p className="text-white font-medium">{new Date(portal.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300">Last Visited</p>
              <p className="text-white font-medium">{new Date(portal.lastVisited).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {portal.modules.overview && (
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
              <BarChart3 className="w-5 h-5 text-blue-400" aria-hidden="true" />
              {portal.modules.overview.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{portal.modules.overview.summary}</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" aria-hidden="true" />
                <p className="text-sm text-gray-300">
                  Total Leads: <span className="font-medium text-white">{portal.modules.leads?.leads.length || 0}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-green-400" aria-hidden="true" />
                <p className="text-sm text-gray-300">
                  Active Tasks: <span className="font-medium text-white">
                    {portal.modules.tasks?.tasks.filter((t) => !t.completed).length || 0}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {portal.modules.leads && portal.modules.leads.leads.length > 0 && (
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
              <Users className="w-5 h-5 text-blue-400" aria-hidden="true" />
              Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {portal.modules.leads.leads.map((lead, index) => (
                <div
                  key={lead._id || index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                >
                  <div>
                    <p className="text-white font-medium">{lead.name}</p>
                    <p className="text-sm text-gray-300">{lead.email}</p>
                  </div>
                  <Badge className="bg-gray-700 text-white">Lead</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {portal.modules.tasks && portal.modules.tasks.tasks.length > 0 && (
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
              <CheckSquare className="w-5 h-5 text-green-400" aria-hidden="true" />
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {portal.modules.tasks.tasks.map((task, index) => (
                <div
                  key={task._id || index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${task.completed ? "bg-green-400" : "bg-red-400"}`}
                      aria-hidden="true"
                    ></div>
                    <p className="text-white">{task.title}</p>
                  </div>
                  <Badge
                    className={task.completed ? "bg-green-900 text-green-200 border-green-800" : "bg-red-900 text-red-200 border-red-800"}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default function View({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  return (
    <SessionProvider>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading...</div>}>
        <PortalView portalId={slug} />
      </Suspense>
    </SessionProvider>
  );
}