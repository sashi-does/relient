'use client'

import React from 'react';
import OverviewSection from './OverviewSection';
import TasksSection from './TaskSection';
import LeadsSection from './LeadSection';
import PaymentsSection from './PaymentSection';
import AppointmentsSection from './AppointmentSection';
import type { DashboardData } from '@repo/types/ui-types';

interface DashboardContentProps {
  activeSection: string;
  data: DashboardData;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeSection, data }) => {
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection data={data} />;
      case 'tasks':
        return data.modules.tasks ? <TasksSection tasks={data.modules.tasks.tasks} /> : null;
      case 'leads':
        return data.modules.leads ? <LeadsSection leads={data.modules.leads.leads} /> : null;
      case 'payments':
        return data.modules.payments ? <PaymentsSection payments={data.modules.payments.payments} /> : null;
      case 'appointments':
        return data.modules.appointments ? <AppointmentsSection appointments={data.modules.appointments.appointments} /> : null;
      default:
        return <OverviewSection data={data} />;
    }
  };

  return (
    <div className="p-4 lg:p-6">
      {renderSectionContent()}
    </div>
  );
};

export default DashboardContent;