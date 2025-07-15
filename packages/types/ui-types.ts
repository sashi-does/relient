import { motion } from "framer-motion";

export interface BentoItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    status?: string;
    tags?: string[];
    meta?: string;
    cta?: string;
    colSpan?: number;
    hasPersistentHover?: boolean;
}

export interface DashboardData {
    _id: string;
    portalName: string;
    clientName: string;
    clientEmail: string;
    projectDescription: string;
    userId: string;
    inbox: number;
    status: string;
    createdAt: string;
    lastVisited: string;
    modules: {
      overview?: {
        title: string;
        summary: string;
      };
      tasks?: {
        tasks: Array<{
          id: string;
          title: string;
          description: string;
          status: string;
          priority: string;
          dueDate: string;
        }>;
      };
      leads?: {
        leads: Array<{
          id: string;
          name: string;
          email: string;
          phone: string;
          status: string;
          value: number;
          source: string;
        }>;
      };
      payments?: {
        payments: Array<{
          id: string;
          client: string;
          amount: number;
          status: string;
          dueDate: string;
          invoiceNumber: string;
        }>;
      };
      appointments?: {
        appointments: Array<{
          id: string;
          title: string;
          client: string;
          date: string;
          time: string;
          status: string;
          meetingUrl: string;
        }>;
      };
    };
  }
  
  export interface DashboardSection {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    available: boolean;
    component: React.ComponentType<any>;
  }

export interface BentoGridProps {
    items: BentoItem[];
}

export type ViewAnimationProps = {
	delay?: number;
	className?: React.ComponentProps<typeof motion.div>['className'];
	children: React.ReactNode;
};

export type FeatureType = {
	title: string;
	icon: string;
	description: string;
};

export type FeatureCardProps = React.ComponentProps<'div'> & {
	feature: FeatureType;
};