import { NextRequest, NextResponse } from "next/server";
import { connectDb, mongoose } from "@repo/db/mongoose"
import { PortalModel, PortalSchema } from "@repo/types/mongo-types";
import options from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { prisma } from "@repo/db/prisma";



const Portal = mongoose.models.Portal || mongoose.model("Portal", PortalSchema);

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(options)
        console.log("POST: Portal" + JSON.stringify(session))
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

        const { portalName, name, mail, description } = await req.json();
        console.log("📨 Request received:", { name, mail, description });


        await connectDb();


        const portal = await (Portal as any).insertOne({
            portalName,
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



export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(options);
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "Unauthenticated user"
            }, { status: 401 });
        }

        const user = await prisma.user.findFirst({
            where: {
                email: session.user?.email as string
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid user"
            }, { status: 403 });
        }

        const { portalId, modules, data } = await req.json();

        if (!portalId || !modules || !data) {
            return NextResponse.json({
                success: false,
                message: "Missing required fields: portalId, modules, or data"
            }, { status: 400 });
        }

        await connectDb();

        // Validate portal ownership
        const portal = await Portal.findOne({ _id: portalId, userId: user.id });
        if (!portal) {
            return NextResponse.json({
                success: false,
                message: "Portal not found or user not authorized"
            }, { status: 404 });
        }

        // Prepare modules update
        const modulesUpdate: any = {
            overview: portal.modules?.overview || { title: "Overview", summary: `Portal overview for ${portal.portalName}` },
            tasks: portal.modules?.tasks || { tasks: [] },
            leads: portal.modules?.leads || { leads: [] }
        };

        // Update enabled modules based on the request
        modules.forEach((module: { id: string; enabled: boolean }) => {
            if (module.id === "overview") {
                // Overview is always enabled
                modulesUpdate.overview = {
                    title: "Overview",
                    summary: `Portal overview for ${portal.portalName}`
                };
            } else if (module.id === "tasks" && module.enabled) {
                modulesUpdate.tasks = {
                    tasks: data.tasks.map((task: any) => ({
                        title: task.title,
                        completed: task.status === "completed"
                    }))
                };
            } else if (module.id === "leads" && module.enabled) {
                modulesUpdate.leads = {
                    leads: data.leads.map((lead: any) => ({
                        name: lead.name,
                        email: lead.email
                    }))
                };
            } else if (!module.enabled && module.id !== "overview") {
                // Only set to null if explicitly disabled and no data provided
                if (!data[module.id] || data[module.id].length === 0) {
                    modulesUpdate[module.id] = null;
                }
            }
        });

        // Update portal with new modules data
        const updatedPortal = await Portal.findByIdAndUpdate(
            portalId,
            {
                $set: {
                    modules: modulesUpdate,
                    lastVisited: new Date(),
                    status: Object.keys(modulesUpdate).some(key => modulesUpdate[key] && key !== "overview") ? "Active" : "Inactive"
                }
            },
            { new: true }
        );

        if (!updatedPortal) {
            return NextResponse.json({
                success: false,
                message: "Failed to update portal"
            }, { status: 500 });
        }

        console.log("Portal updated:", updatedPortal);

        return NextResponse.json({
            success: true,
            portal: updatedPortal
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating portal:", error);
        return NextResponse.json({
            success: false,
            error: "Internal Server Error"
        }, { status: 500 });
    }
}