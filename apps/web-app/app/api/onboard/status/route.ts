import { prisma } from "@repo/db/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import options from "../../auth/[...nextauth]/options";


export async function GET(req: NextRequest) {
    const session = await getServerSession(options);
    if(!session?.user) {
        return NextResponse.json({
            success: false, 
            message: "UnAuthenticated user"
        })
    }
    const user = await prisma.user.findFirst({
        where: {
            email: (session.user as { email?: string })?.email,
        },
      });
      console.log(user)
      return NextResponse.json({
        success: true,
        status: user?.onboarded
      })
      
}
