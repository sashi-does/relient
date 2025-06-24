import Card from "@/components/ui/card";

export default function Portals() {
  const portals = [
    {
      id: "asasadsdad",
      name: "Acme Corp Portal",
      company: "Acme Corp",
      status: "Active",
      progress: 85,
      lastActivity: "2 minutes ago",
      members: 8,
      messages: 24,
    },
  ];

  return (
    <div className="space-y-4 p-4">
      {portals.map((p) => (
        <Card
          key={p.id}
          type="portal"
          heading={p.name}
          subheading={p.company}
          status={p.status}
          progress={p.progress}
          lastActivity={p.lastActivity}
          members={p.members}
          messages={p.messages}
        />
      ))}
    </div>
  );
}
