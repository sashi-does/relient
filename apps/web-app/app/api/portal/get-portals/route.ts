import { NextRequest, NextResponse } from "next/server";
import { PortalModel } from "@repo/types/mongo-types";
import { connectDb } from "@repo/db/mongoose";
import { prisma } from "@repo/db/prisma";
import { getServerSession } from "next-auth";
import options from "../../auth/[...nextauth]/options";

export default async function GET(req: NextRequest, { params: string } : { params: { portalId : string } }) {
    const session = await getServerSession(options);
      if (!session) {
        return NextResponse.json({
          success: false,
          message: "Unauthenticated user",
        }, { status: 401 });
      }
  
      const user = await prisma.user.findFirst({
        where: {
          email: session.user?.email as string,
        },
      });
  
      if (!user) {
        return NextResponse.json({
          success: false,
          message: "Invalid user",
        }, { status: 403 });
      }
    await connectDb()
    const portals = await PortalModel.findOne({
        _id: portalId,
        userId: user.id
    })
    return NextResponse.json({
        portals
    })

}