import { NextRequest, NextResponse } from "next/server";
import { connectDb, mongoose } from "@repo/db/mongoose"
import { PortalModel } from "@repo/types/mongo-types";
import options from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { prisma } from "@repo/db/prisma";
import { Portal } from "@repo/types/interfaces";

export async function GET(req: NextRequest) {
    try {
      const session = await getServerSession(options);
      await connectDb()
      if (!session) {
        return NextResponse.json({
          success: false,
          message: "Unauthenticated user",
        }, { status: 401 });
      }
  
      const user = await prisma.user.findFirst({
        where: {
          email: (session.user as { email?: string })?.email,
        },
      });
  
      if (!user) {
        return NextResponse.json({
          success: false,
          message: "Invalid user",
        }, { status: 403 });
      }
  
      // Extract portalId from query parameters
      const portalId = req.nextUrl.searchParams.get('portalId');
      if (!portalId) {
        return NextResponse.json({
          success: false,
          message: "Missing portalId in query parameters",
        }, { status: 400 });
      }
  
      if (!mongoose.Types.ObjectId.isValid(portalId)) {
        return NextResponse.json({
          success: false,
          message: "Invalid portalId format",
        }, { status: 400 });
      }
  
      const portal = await (PortalModel as mongoose.Model<Portal>).findOne({ _id: portalId, userId: user.id });
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

export async function POST(req: NextRequest) {
    try {
        console.log("POST: portal create")
        const session = await getServerSession(options)
        console.log("POST: Portal" + JSON.stringify(session))
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "Unauthenticated user"
            })
        }

        const user = await prisma.user.findFirst({
            where: { email: (session.user as { email: string }).email },
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


        const portal = await PortalModel.insertOne({
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
        // authenticate user
        const session = await getServerSession(options);
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "Unauthenticated user"
            }, { status: 401 });
        }


        const user = await prisma.user.findFirst({
            where: { email: (session.user as { email: string }).email },
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid user"
            }, { status: 403 });
        }

        // parse request body
        const { portalId, modules, data, feedback } = await req.json();
        console.log("Portal SASASASASAS ID:", feedback);
        console.log("Modules:", JSON.stringify(modules));

        // validate required fields
        if (!portalId || !modules || !data) {
            return NextResponse.json({
                success: false,
                message: "Missing required fields: portalId, modules, or data"
            }, { status: 400 });
        }

        
        await connectDb();

        // validate portal ownership
        const portal = await (PortalModel as mongoose.Model<Portal>).findOne({ _id: portalId, userId: user.id });
        if (!portal) {
            return NextResponse.json({
                success: false,
                message: "Portal not found or user not authorized"
            }, { status: 404 });
        }

        // initialize modulesUpdate with all possible modules
        const modulesUpdate: { [key: string]: any } = {
            overview: portal.modules?.overview || { title: "Overview", summary: `Portal overview for ${portal.portalName}` },
            tasks: portal.modules?.tasks || { tasks: [] },
            leads: portal.modules?.leads || { leads: [] },
            payments: portal.modules?.payments || { payments: [] },
            appointments: portal.modules?.appointments || { appointments: [] }
        };

        // Process each module
        modules.forEach((module: { id: string; enabled: boolean }) => {
            if (module.id === "overview") {
                modulesUpdate.overview = {
                    title: "Overview",
                    summary: `Portal overview for ${portal.portalName}`
                };
            } else if (module.id === "tasks" && module.enabled) {
                modulesUpdate.tasks = {
                    tasks: data.tasks?.map((task: any) => ({
                        id: task.id,
                        title: task.title,
                        description: task.description,
                        status: task.status,
                        priority: task.priority,
                        dueDate: task.dueDate
                    })) || []
                };
            } else if (module.id === "leads" && module.enabled) {
                modulesUpdate.leads = {
                    leads: data.leads?.map((lead: any) => ({
                        id: lead.id,
                        name: lead.name,
                        email: lead.email,
                        phone: lead.phone,
                        status: lead.status,
                        value: lead.value,
                        source: lead.source
                    })) || []
                };
            } else if (module.id === "payments" && module.enabled) {
                modulesUpdate.payments = {
                    payments: data.payments?.map((payment: any) => ({
                        id: payment.id,
                        client: payment.client,
                        amount: payment.amount,
                        status: payment.status,
                        dueDate: payment.dueDate,
                        invoiceNumber: payment.invoiceNumber
                    })) || []
                };
            } else if (module.id === "appointments" && module.enabled) {
                modulesUpdate.appointments = {
                    appointments: data.appointments?.map((appointment: any) => ({
                        id: appointment.id,
                        title: appointment.title,
                        client: appointment.client,
                        date: appointment.date,
                        time: appointment.time,
                        status: appointment.status,
                        meetingUrl: appointment.meetingUrl
                    })) || []
                };
            } else if (!module.enabled && module.id !== "overview") {
                // Set to null if explicitly disabled and no data provided
                if (!data[module.id] || data[module.id].length === 0) {
                    modulesUpdate[module.id] = null;
                }
            }
        });

        // update portal in MongoDB (may or may not)
        const updatedPortal = await (PortalModel as mongoose.Model<Portal>).findByIdAndUpdate(
            portalId,
            {
                $set: {
                    modules: modulesUpdate,
                    lastVisited: new Date(),
                    feedback: feedback,
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


export async function DELETE(req: NextRequest) {
    try {
        const { portalId } = await req.json()
        await connectDb()
        console.log(portalId)
        await PortalModel.deleteOne({
            _id: portalId
        })
        return NextResponse.json({
            success: true,
            message: "Portal Deleted successfully"
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: (error as Error).message
        })
    }
}
