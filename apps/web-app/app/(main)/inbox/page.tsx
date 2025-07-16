import options from "@/app/api/auth/[...nextauth]/options";
import GenericPlaceholder from "@/components/blocks/generic-placeholder";
import { connectDb, mongoose } from "@repo/db/mongoose";
import FeedbackInbox from "@/components/blocks/feedback-inbox"
import {
  FeedbackModel,
  PortalModel,
  FeedbackSchema,
  PortalSchema,
} from "@repo/types/mongo-types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Inbox() {
  const session = await getServerSession(options);
  if (!session?.user) {
    redirect("/");
  }
  await connectDb();
  const portals = await (
    PortalModel as mongoose.Model<typeof PortalSchema>
  ).find({
    userId: session.user.id,
  });
  const portalIds = portals.map((p) => p._id.toString());
  const messages = await (
    FeedbackModel as mongoose.Model<typeof FeedbackSchema>
  )
    .find({
      portalId: { $in: portalIds },
    })
    .sort({ createdAt: -1 });
    console.log(messages)

  return (
    <div className="h-[95vh] flex justify-center items-center">
      {messages.length === 0 ? (
        <GenericPlaceholder
          heading="You have no messages"
          paragraph="Your inbox is empty. Send a message to a friend to get started."
          image="/Inbox.png"
        />
      ) : (
        <>
          <FeedbackInbox
            messages={messages.map((msg: any) => ({
              portalId: msg.portalId,
              clientEmail: msg.clientEmail,
              clientName: msg.clientName,
              message: msg.message,
              createdAt: msg.createdAt,
              isRead: msg.isRead,
              _id: msg._id?.toString?.() ?? "",
            }))}
          />
        </>
      )}
    </div>
  );
}
