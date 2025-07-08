import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Portal } from "@repo/types/interfaces";
import Card from "../ui/card";
import Stats from "./stats";
import Input from "@repo/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Button } from "@repo/ui/button";
import { Filter } from "lucide-react";
import GenericPlaceholder from "./generic-placeholder";

type PortalWithId = Portal & { _id: string };

export function GlassTabs({ portals }: { portals: PortalWithId[] }) {
  return (
    <div>
      <Tabs defaultValue="overview" className="">
        <div className="backdrop-blur-md  border-white/10 rounded-2xl p-1 shadow-xl">
          <TabsList className="bg-transparent p-0 gap-2">
            <TabsTrigger value="overview" className="glass-tab">
              Overview
            </TabsTrigger>
            <TabsTrigger value="portals" className="glass-tab">
              All Portals
            </TabsTrigger>
            <TabsTrigger value="templates" className="glass-tab">
              Templates
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="text-muted-foreground mt-4">
          <div className="flex flex-col md:flex-row justify-between space-x-[20px]">
            <Stats count={portals.length} type="portals" />
            <Stats
              // count={portals.filter((p) => p.status === "Active").length}
              count={portals.length}
              type="activeStatus"
            />
            <Stats type="progress" />
          </div>

          <div className="mt-8 text-left space-y-2">
            <h2 className="text-lg font-semibold text-white">
              Recently Active
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portals
                .filter((p) => p.lastVisited)
                .sort(
                  (a, b) =>
                    new Date(a.lastVisited ? a.lastVisited.toString() : 0).getTime() -
                    new Date(b.lastVisited ? b.lastVisited.toString() : 0).getTime()
                )
                .slice(0, 3)
                .map((p) => (
                  <Card
                    key={p._id}
                    portalId={p._id}
                    type="portal"
                    heading={p.portalName}
                    subheading={p.clientName}
                    status={p.status}
                    progress={0}
                    lastActivity={p.lastVisited ? `Last visited: ${p.lastVisited.toLocaleString()}` : "Never"}
                    members={0}
                    messages={p.inbox || 0}
                  />
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="portals">
          <div className="flex items-center gap-4">
            <Input
              className="w-[250px]"
              type="search"
              placeholder="Search portals..."
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex bg-[#0F0F0F] items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Inactive</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ul className="flex flex-wrap gap-x-5 text-muted-foreground mt-4">
            {portals.map((p) => (
              <li key={p._id}>
                <Card
                  key={p._id}
                  portalId={p._id}
                  type="portal"
                  heading={p.portalName}
                  subheading={p.clientName}
                  status={p.status}
                  progress={0}
                  lastActivity={p.lastVisited ? `Last visited: ${p.lastVisited.toLocaleString()}` : "Never"}
                  members={0}
                  messages={p.inbox || 0}
                />
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent
          value="templates"
          className="h-[95vh] flex justify-center items-center mt-4"
        >
          
          <GenericPlaceholder heading="Portal Templates" paragraph="Coming soon!!" image="/template.png" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
