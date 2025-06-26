import { NextRequest, NextResponse } from "next/server";
import { connectDb, mongoose } from "@repo/db/mongoose";
import { PortalSchema } from "@repo/types/mongo-types";

// Define model only once at the top-level to avoid re-definition issues
const Portal = mongoose.models.Portal || mongoose.model("Portal", PortalSchema);

export async function POST(req: NextRequest) {
  try {
    const { name, email, desc } = await req.json();

    console.log("📨 Request received:", { name, email, desc });


    await connectDb();


    const created = await Portal.create({
      clientEmail: email,
      clientName: name,
      projectDescription: desc,
    });

    console.log("✅ Portal created:", created);

    return NextResponse.json({ success: true, portal: created }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating portal:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
