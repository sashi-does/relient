'use client'

import React, { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Sidebar } from './sidebar';
import { Overview } from './modules/OverviewModule';
import { TasksModule } from './modules/TaskModule';
import { LeadsModule } from './modules/LeadsModule';
import { PaymentsModule } from './modules/PaymentModule';
import { InvoiceModule } from './modules/InvoiceModule';
import { Eye, Save, HelpCircle, Menu, RotateCcw } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@repo/ui/sheet';

import { TopNavbar } from './navbar';
import { Button } from '@repo/ui/button';
import { Switch } from '@repo/ui/switch';
import { Label } from '@repo/ui/label';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@repo/ui/tooltip';
import { toast } from 'sonner';
import { AppointmentsModule } from './modules/AppointmentsModule';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  value: number;
  source?: string;
}

export interface Appointment {
  id: string;
  title: string;
  client: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  meetingUrl?: string;
}

export interface Payment {
  id: string;
  client: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
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
  const [activeModule, setActiveModule] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [feedbackEnabled, setFeedbackEnabled] = useState(false);
  const [moduleSettings, setModuleSettings] = useState<ModuleSettings>({
    tasks: true,
    leads: true,
    appointments: true,
    payments: true,
  });

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review client proposal',
      description: 'Review and provide feedback on the new client proposal',
      status: 'backlog',
      priority: 'high',
      dueDate: '2024-01-15',
    },
    {
      id: '2',
      title: 'Update website content',
      description: 'Update the about page with new team information',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2024-01-20',
    },
    {
      id: '3',
      title: 'Client meeting preparation',
      description: 'Prepare materials for upcoming client presentation',
      status: 'completed',
      priority: 'high',
      dueDate: '2024-01-10',
    },
  ]);

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      status: 'new',
      value: 5000,
      source: 'Website',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 234 567 8901',
      status: 'qualified',
      value: 8500,
      source: 'Referral',
    },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      title: 'Client Discovery Call',
      client: 'John Smith',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'scheduled',
      meetingUrl: 'https://meet.google.com/abc-def-ghi',
    },
    {
      id: '2',
      title: 'Project Review',
      client: 'Sarah Johnson',
      date: '2024-01-16',
      time: '2:00 PM',
      status: 'scheduled',
    },
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      client: 'John Smith',
      amount: 2500,
      status: 'pending',
      dueDate: '2024-01-20',
      invoiceNumber: 'INV-001',
    },
    {
      id: '2',
      client: 'Sarah Johnson',
      amount: 4250,
      status: 'paid',
      dueDate: '2024-01-15',
      invoiceNumber: 'INV-002',
    },
  ]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId as Task['status'];
    
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === draggableId ? { ...t, status: newStatus } : t
      )
    );

    toast.success(`Task moved to ${newStatus.replace('-', ' ')}`);
  };

  const handleModuleToggle = (module: keyof ModuleSettings) => {
    setModuleSettings(prev => ({
      ...prev,
      [module]: !prev[module]
    }));
  };

  const handleSave = () => {
    toast.success("Your portal configuration has been saved successfully.");
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
    toast.success( "All tasks, leads, appointments, and payments have been cleared");
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'overview':
        return <Overview tasks={tasks} leads={leads} appointments={appointments} payments={payments} />;
      case 'tasks':
        return moduleSettings.tasks ? (
          <TasksModule tasks={tasks} setTasks={setTasks} onDragEnd={handleDragEnd} />
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Tasks module is disabled
          </div>
        );
      case 'leads':
        return moduleSettings.leads ? (
          <LeadsModule leads={leads} setLeads={setLeads} />
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Leads module is disabled
          </div>
        );
      case 'appointments':
        return moduleSettings.appointments ? (
          <AppointmentsModule appointments={appointments} setAppointments={setAppointments} />
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Appointments module is disabled
          </div>
        );
      case 'payments':
        return moduleSettings.payments ? (
          <PaymentsModule payments={payments} setPayments={setPayments} />
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Payments module is disabled
          </div>
        );
      case 'invoice':
        return <InvoiceModule />;
      default:
        return <Overview tasks={tasks} leads={leads} appointments={appointments} payments={payments} />;
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-background flex">
        {/* Mobile Sidebar */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="fixed top-4 left-4 z-50">
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
        <div className="hidden md:block fixed left-0 top-0 h-full z-10">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={setSidebarCollapsed}
            activeModule={activeModule}
            onModuleChange={setActiveModule}
            moduleSettings={moduleSettings}
            onModuleToggle={handleModuleToggle}
          />
        </div>
        
        <div className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}>
          <TopNavbar />
          
          <div className="flex-1 p-3 md:p-6 overflow-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold">
                {activeModule.charAt(0).toUpperCase() + activeModule.slice(1)}
              </h1>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <Label htmlFor="feedback-toggle" className="text-sm">Client Feedback</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1">
                          <Switch
                            id="feedback-toggle"
                            checked={feedbackEnabled}
                            onCheckedChange={setFeedbackEnabled}
                          />
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Feedbacks will be received in the inbox of your dashboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button onClick={handleResetAll} variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">Reset All</span>
                    <span className="sm:hidden">Reset</span>
                  </Button>
                  <Button onClick={handlePreview} variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Live Preview</span>
                    <span className="sm:hidden">Preview</span>
                  </Button>
                  <Button onClick={handleSave} className="flex items-center gap-2 w-full sm:w-auto">
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Save Portal</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in">
              {renderActiveModule()}
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};
