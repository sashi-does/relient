import { Date } from "mongoose";

export type User = {
  id: String;
  username: String;
  email: String;
  password: String | null;
  image: String | null;
  onboarded: Boolean;
  createdAt: Date;
  plan: String;
}

// export interface Agency {
//   id: String;
//   agencyName: String;
//   website: String | null;
//   logo: String | null;
//   userId: String;
//   industry: String;
//   teamSize: Number;
// }

export interface OverviewModule {
  title: string;
  summary: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string; 
  priority: string; 
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
  status: string; 
  value: number;
  source: string; 
}

export interface LeadModule {
  leads: Lead[];
}

export interface Payment {
  id: string;
  client: string;
  amount: number;
  status: string;
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
  status: string;
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