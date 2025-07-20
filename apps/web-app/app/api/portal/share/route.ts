import { NextRequest, NextResponse } from "next/server";
import { mongoose } from "@repo/db/mongoose"
import { PortalModel } from "@repo/types/mongo-types";
import { Portal } from "@repo/types/interfaces";

export async function GET(req: NextRequest) {
    try {
      const slug = req.headers.get("slug")
      const portal = await (PortalModel as mongoose.Model<Portal>).findOne({ slug });
      if (!portal) {
        return NextResponse.json({
          success: false,
          message: "Portal not found or user not authorized",
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        portal,
      }, { status: 200 });
    } catch (error) {
      console.error("Error fetching portal:", error);
      return NextResponse.json({
        success: false,
        error: "Internal Server Error",
      }, { status: 500 });
    }
  }