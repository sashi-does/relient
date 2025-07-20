import { Date } from "mongoose";

export interface OverviewModule {
  title: string;
  summary: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string; // e.g., "backlog", "in-progress", "completed"
  priority: string; // e.g., "high", "medium", "low"
  dueDate: string;
}

export interface TaskModule {
  tasks: Task[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string; // e.g., "new", "qualified"
  value: number;
  source: string; // e.g., "Website", "Referral"
}

export interface LeadModule {
  leads: Lead[];
}

export interface Payment {
  id: string;
  client: string;
  amount: number;
  status: string; // e.g., "pending", "paid"
  dueDate: string;
  invoiceNumber: string;
}

export interface PaymentModule {
  payments: Payment[];
}

export interface Appointment {
  id: string;
  title: string;
  client: string;
  date: string;
  time: string;
  status: string; // e.g., "scheduled"
  meetingUrl: string;
}

export interface AppointmentModule {
  appointments: Appointment[];
}

export interface Portal {
  _id: string;
  portalName: string;
  clientName: string;
  clientEmail: string;
  projectDescription: string;
  progress: number;
  inbox: number;
  status: string;
  slug: string;
  createdAt: Date;
  lastVisited: Date | null;
  userId: string;
  feedback?: boolean;
  modules: {
    overview?: OverviewModule;
    tasks?: TaskModule;
    leads?: LeadModule;
    payments?: PaymentModule;
    appointments?: AppointmentModule;
  };
}