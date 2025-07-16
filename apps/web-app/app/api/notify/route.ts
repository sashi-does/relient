import { connectDb, mongoose } from "@repo/db/mongoose";
import { FeedbackModel, PortalModel } from "@repo/types/mongo-types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { feedback, portalId } = await req.json()
        await connectDb()
        const portal = await (PortalModel as any).findOne({ _id: portalId });
        console.log(portal)

        const res = await FeedbackModel.insertOne({
            message: feedback,
            portalId,
            clientName: portal?.clientName,
            clientEmail: portal?.clientEmail,
        });

        console.log(res)

        return NextResponse.json({
            success: true,
            message: "Feedback sent successfully"
        })

    } catch (e) {
        return NextResponse.json({
            success: false,
            message: (e as Error).toString()
        })
    }

}