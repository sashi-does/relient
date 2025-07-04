import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Portal } from "@repo/types/interfaces";
import Card from "../ui/card";
import Stats from "./stats"

export function GlassTabs({ portals }: { portals: Portal[] }) {
 
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
            <TabsTrigger value="packages" className="glass-tab">
              Packages
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="text-center text-muted-foreground mt-4">
          <div className="flex flex-col md:flex-row justify-between space-x-[20px]">
            <Stats count={portals.length} type="portals" />
            <Stats count={portals.filter(p => p.status === "Active").length} count={portals.length} type="activeStatus" />
            <Stats type="progress" />
            
          </div>
        </TabsContent>
        <TabsContent value="portals" className={`text-center flex flex-wrap gap-x-5 text-muted-foreground mt-4`}>
        {portals.map((p: any) => (
        <Card
          key={p._id}
          portalId={p._id}
          type="portal"
          heading={p.portalName}
          subheading={p.clientName}
          status={p.status}
          progress={0}
          lastActivity={
            p.lastVisited
              ? `Last visited: ${new Date(p.lastVisited).toLocaleString()}`
              : "Never"
          }
          members={0}
          messages={p.inbox || 0}
        />
      ))}
        </TabsContent>
        <TabsContent value="packages" className="text-center text-muted-foreground mt-4">
          Content for Packages
        </TabsContent>
      </Tabs>
    </div>
  );
}
