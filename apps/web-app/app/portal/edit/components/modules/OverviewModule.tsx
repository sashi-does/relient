'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Progress } from '@repo/ui/progress';
import { 
  CheckSquare, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Clock,
  Target,
  Badge
} from 'lucide-react';
import { Task, Lead, Appointment, Payment } from '../dashboard';

interface OverviewProps {
  tasks: Task[];
  leads: Lead[];
  appointments: Appointment[];
  payments: Payment[];
}

export const Overview: React.FC<OverviewProps> = ({
  tasks,
  leads,
  appointments,
  payments,
}) => {
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const totalLeadValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;

  const upcomingAppointments = appointments.filter(a => 
    new Date(a.date) >= new Date() && a.status === 'scheduled'
  ).length;

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const totalPendingAmount = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{totalTasks}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
              <Progress value={taskCompletionRate} className="flex-1" />
              <span className="whitespace-nowrap">{Math.round(taskCompletionRate)}% complete</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">${totalLeadValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {qualifiedLeads} qualified leads
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Upcoming this week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">${totalPendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {pendingPayments.length} invoices due
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Target className="h-4 w-4 md:h-5 md:w-5" />
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge 
                    variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {task.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Clock className="h-4 w-4 md:h-5 md:w-5" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            {appointments
              .filter(apt => new Date(apt.date) >= new Date())
              .slice(0, 5)
              .map(appointment => (
                <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{appointment.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.client} • {appointment.time}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {new Date(appointment.date).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
