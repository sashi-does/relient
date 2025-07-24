import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import options from "../auth/[...nextauth]/options";
import { prisma } from "@repo/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const portal = await req.json()
    const { agencyName, industry, website, teamSize } = portal; 


    if (!agencyName || !industry || !website || !teamSize) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }
    // console.log("SASASAS")
    console.log(JSON.stringify(portal))

    const dbUser = await prisma.user.findFirst({
        where: {
            email: (session.user as { email?: string })?.email
        }
    })

    if (!dbUser?.id) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    await prisma.agency.create({
      data: {
        agencyName,
        website,
        userId: dbUser?.id,
        industry,
        teamSize: parseInt(teamSize)
      },
    });

    await prisma.user.update({
      where: { email: (session.user as { email?: string })?.email },
      data: { onboarded: true },
    });

    return NextResponse.json(
      { success: true, message: "Successfully onboarded!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(options);
    if(!session?.user) {
        return NextResponse.json({
            success: false, 
            message: "UnAuthenticated user"
        })
    }
    const agency = await prisma.agency.findFirst({
        where: {
          user: {
            email: (session.user as { email?: string })?.email,
          },
        },
      });
      console.log(agency)
      return NextResponse.json({
        success: true,
        agency
      })
      
}
