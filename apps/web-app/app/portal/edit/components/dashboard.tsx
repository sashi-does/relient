"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Sidebar } from "./sidebar";
import { Overview } from "./modules/OverviewModule";
import { TasksModule } from "./modules/TaskModule";
import { LeadsModule } from "./modules/LeadsModule";
import { PaymentsModule } from "./modules/PaymentModule";
import { Eye, Save, HelpCircle, Menu, RotateCcw } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@repo/ui/sheet";
import { TopNavbar } from "./navbar";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@repo/ui/tooltip";
import { toast, Toaster } from "sonner";
import { AppointmentsModule } from "./modules/AppointmentsModule";
import { Switch } from "@repo/ui/switch";
import axios from "axios";
import { useParams } from "next/navigation";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "backlog" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  assignedTo?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "new" | "contacted" | "qualified" | "converted";
  value: number;
  source?: string;
}

export interface Appointment {
  id: string;
  title: string;
  client: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  meetingUrl?: string;
}

export interface Payment {
  id: string;
  client: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: string;
  invoiceNumber: string;
}

export interface ModuleSettings {
  tasks: boolean;
  leads: boolean;
  appointments: boolean;
  payments: boolean;
}

export const Dashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [feedbackEnabled, setFeedbackEnabled] = useState(false);
  const [moduleSettings, setModuleSettings] = useState<ModuleSettings>({
    tasks: true,
    leads: true,
    appointments: true,
    payments: true,
  });
  const params = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Fetch portal details on mount
  useEffect(() => {
    const fetchPortalDetails = async () => {
      try {
        const portalId = params.slug;
        if (!portalId) {
          toast.error("Portal ID is missing.");
          return;
        }

        const response = await axios.get(`/api/portal?portalId=${portalId}`);
        if (response.data.success) {
          const portal = response.data.portal;

          // Update state with fetched data
          setTasks(portal.modules?.tasks?.tasks || []);
          setLeads(portal.modules?.leads?.leads || []);
          setPayments(portal.modules?.payments?.payments || []);
          setAppointments(portal.modules?.appointments?.appointments || []);

          // Update module settings based on fetched data
          setModuleSettings({
            tasks: !!portal.modules?.tasks?.tasks?.length,
            leads: !!portal.modules?.leads?.leads?.length,
            appointments: !!portal.modules?.appointments?.appointments?.length,
            payments: !!portal.modules?.payments?.payments?.length,
          });
        } else {
          toast.error(response.data.message || "Failed to fetch portal details.");
        }
      } catch (error) {
        console.error("Error fetching portal details:", error);
        toast.error("An error occurred while fetching portal details.");
      }
    };

    fetchPortalDetails();
  }, [params.slug]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId as Task["status"];

    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === draggableId ? { ...t, status: newStatus } : t
      )
    );

    toast.success(`Task moved to ${newStatus.replace("-", " ")}`);
  };

  const handleModuleToggle = (module: keyof ModuleSettings) => {
    setModuleSettings((prev) => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  const handleSave = async () => {
    try {
      const portalId = params.slug;
      if (!portalId) {
        toast.error("Portal ID is missing.");
        return;
      }

      // Structure modules as an array of { id, enabled } objects
      const modules = [
        { id: "tasks", enabled: moduleSettings.tasks && tasks.length > 0 },
        { id: "leads", enabled: moduleSettings.leads && leads.length > 0 },
        { id: "payments", enabled: moduleSettings.payments && payments.length > 0 },
        { id: "appointments", enabled: moduleSettings.appointments && appointments.length > 0 },
      ];

      // Structure data object with the actual module data
      const data = {
        tasks: tasks || [],
        leads: leads || [],
        payments: payments || [],
        appointments: appointments || [],
      };

      const response = await axios.patch("/api/portal", { portalId, modules, data });

      if (response.data.success) {
        toast.success("Your portal configuration has been saved successfully.");
      } else {
        toast.error(response.data.message || "Failed to save portal configuration.");
      }
    } catch (error) {
      console.error("Error saving portal:", error);
      toast.error("An error occurred while saving the portal configuration.");
    }
  };

  const handlePreview = () => {
    toast.success("Opening live preview in a new window...");
    // In a real app, this would open a new window with the client portal
  };

  const handleResetAll = () => {
    setTasks([]);
    setLeads([]);
    setAppointments([]);
    setPayments([]);
    setModuleSettings({
      tasks: false,
      leads: false,
      appointments: false,
      payments: false,
    });
    toast.success("All tasks, leads, appointments, and payments have been cleared");
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case "overview":
        return (
          <Overview
            tasks={tasks}
            leads={leads}
            appointments={appointments}
            payments={payments}
          />
        );
      case "tasks":
        return moduleSettings.tasks ? (
          <TasksModule
            tasks={tasks}
            setTasks={setTasks}
            onDragEnd={handleDragEnd}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Tasks module is disabled
          </div>
        );
      case "leads":
        return moduleSettings.leads ? (
          <LeadsModule leads={leads} setLeads={setLeads} />
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Leads module is disabled
          </div>
        );
      case "appointments":
        return moduleSettings.appointments ? (
          <AppointmentsModule
            appointments={appointments}
            setAppointments={setAppointments}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Appointments module is disabled
          </div>
        );
      case "payments":
        return moduleSettings.payments ? (
          <PaymentsModule payments={payments} setPayments={setPayments} />
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Payments module is disabled
          </div>
        );
      default:
        return (
          <Overview
            tasks={tasks}
            leads={leads}
            appointments={appointments}
            payments={payments}
          />
        );
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Toaster />
      <div className="min-h-screen bg-[#0F0F0F] flex">
        {/* Mobile Sidebar */}
        <div className="bg-[#171717] md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="fixed top-4 left-4 z-50"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar
                collapsed={false}
                onToggle={() => {}}
                activeModule={activeModule}
                onModuleChange={setActiveModule}
                moduleSettings={moduleSettings}
                onModuleToggle={handleModuleToggle}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <div className="bg-[#171717] hidden md:block fixed left-0 top-0 h-full z-10">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={setSidebarCollapsed}
            activeModule={activeModule}
            onModuleChange={setActiveModule}
            moduleSettings={moduleSettings}
            onModuleToggle={handleModuleToggle}
          />
        </div>

        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-16" : "md:ml-64"
          }`}
        >
          <TopNavbar
            feedbackEnabled={feedbackEnabled}
            setFeedbackEnabled={setFeedbackEnabled}
            handleResetAll={handleResetAll}
            handlePreview={handlePreview}
            handleSave={handleSave}
          />

          <div className="flex-1 p-3 md:p-6 overflow-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4"></div>

            <div className="animate-fade-in">{renderActiveModule()}</div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};