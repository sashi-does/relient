'use client'

import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle, 
  TrendingUp, 
  DollarSign, 
  Calendar
} from 'lucide-react';

import OverviewSection from './OverviewSection';
import TasksSection from './TaskSection';
import LeadsSection from './LeadSection';
import PaymentsSection from './PaymentSection';
import AppointmentsSection from './AppointmentSection';
import DashboardHeader from './DashboardHeader';
import DashboardNavigation from './DashboardNavigation';
import DashboardContent from './DashboardContent';
import type { DashboardData, DashboardSection } from '@repo/types/ui-types';

interface DashboardProps {
  data: DashboardData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const sections: DashboardSection[] = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: Activity, 
      available: true,
      component: OverviewSection 
    },
    { 
      id: 'tasks', 
      name: 'Tasks', 
      icon: CheckCircle, 
      available: !!data.modules.tasks,
      component: TasksSection 
    },
    { 
      id: 'leads', 
      name: 'Leads', 
      icon: TrendingUp, 
      available: !!data.modules.leads,
      component: LeadsSection 
    },
    { 
      id: 'payments', 
      name: 'Payments', 
      icon: DollarSign, 
      available: !!data.modules.payments,
      component: PaymentsSection 
    },
    { 
      id: 'appointments', 
      name: 'Appointments', 
      icon: Calendar, 
      available: !!data.modules.appointments,
      component: AppointmentsSection 
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="border-b border-border bg-background sticky top-0 z-10">
          <DashboardHeader data={data} />
          <DashboardNavigation 
            sections={sections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Content Area */}
        <DashboardContent activeSection={activeSection} data={data} />
      </div>
    </div>
  );
};

export default Dashboard;