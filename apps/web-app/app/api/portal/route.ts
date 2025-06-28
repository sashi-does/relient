import { NextRequest, NextResponse } from "next/server";
import { connectDb, mongoose } from "@repo/db/mongoose"
import { PortalSchema } from "@repo/types/mongo-types";
import options from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { prisma } from "@repo/db/prisma";


const Portal = mongoose.models.Portal || mongoose.model("Portal", PortalSchema);

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(options)
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "Unauthenticated user"
            })
        }

        const user = await prisma.user.findFirst({
            where: {
                email: session.user?.email as string
            }
        })

        if(!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid user"
            })
        }

        const { name, mail, description } = await req.json();
        console.log("📨 Request received:", { name, mail, description });


        await connectDb();


        const portal = await (Portal as any).insertOne({
            clientName: name,
            clientEmail: mail,
            projectDescription: description,
            createdAt: Date.now(),
            userId: user.id,
        })

        console.log("Portal created:", portal);

        return NextResponse.json({ success: true, portal: portal }, { status: 201 });
    } catch (error) {
        console.error("Error creating portal:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(options)
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "Unauthenticated user"
            })
        }
        const portalId = await prisma.


        await connectDb();


        const portal = await (Portal as any).insertOne({
            clientName: name,
            clientEmail: mail,
            projectDescription: description,
            createdAt: Date.now()
        })

        console.log("Portal created:", portal);

        return NextResponse.json({ success: true, portal: portal }, { status: 201 });
    } catch (error) {
        console.error("Error creating portal:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }

}