import { connectDb, mongoose } from "@repo/db/mongoose";
import { PortalSchema } from "@repo/types/mongo-types";
import { NextRequest, NextResponse } from "next/server";
import { Portal } from "@repo/types/interfaces";


export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId in request body" },
        { status: 400 }
      );
    }

    const portalModel =
      mongoose.models.Portal || mongoose.model("Portal", PortalSchema);

    const portals = await (portalModel as mongoose.Model<Portal>).find({ userId });

    return NextResponse.json(
      {
        success: true,
        portals,
        message: portals.length ? "Portals found" : "No portals found",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching portals:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
