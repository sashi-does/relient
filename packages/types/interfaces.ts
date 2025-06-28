import { Date } from "mongoose";

export interface OverviewModule {
    title: string;
    summary: string;
  }
  
  export interface Task {
    title: string;
    completed: boolean;
  }
  
  export interface TaskModule {
    tasks: Task[];
  }
  
  export interface Lead {
    name: string;
    email: string;
  }
  
  export interface LeadModule {
    leads: Lead[];
  }
  
  export interface Portal {
    clientName: string;
    clientEmail: string;
    projectDescription: string;
    progress: number,
    inbox: number,
    status: number,
    createdAt: Date,
    lastVisited: Date,
    userId: string,
    modules: {
      overview?: OverviewModule;
      tasks?: TaskModule;
      leads?: LeadModule;
    };
  }
  