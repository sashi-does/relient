'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import { Progress } from '@repo/ui/progress';
import { 
  Activity, 
  CheckCircle, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Users,
  Target,
  CreditCard
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface DashboardData {
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

interface OverviewSectionProps {
  data: DashboardData;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ data }) => {
  const tasks = data.modules.tasks?.tasks || [];
  const leads = data.modules.leads?.leads || [];
  const payments = data.modules.payments?.payments || [];
  const appointments = data.modules.appointments?.appointments || [];

  const metrics = {
    taskCompletion: tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0,
    leadConversion: leads.length > 0 ? (leads.filter(l => l.status === 'converted').length / leads.length) * 100 : 0,
    paymentCollection: payments.length > 0 ? (payments.filter(p => p.status === 'paid').length / payments.length) * 100 : 0,
    appointmentCompletion: appointments.length > 0 ? (appointments.filter(a => a.status === 'completed').length / appointments.length) * 100 : 0,
    totalRevenue: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pendingRevenue: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Sample data for trend chart
  const trendData = [
    { name: 'Tasks', completion: metrics.taskCompletion },
    { name: 'Leads', completion: metrics.leadConversion },
    { name: 'Payments', completion: metrics.paymentCollection },
    { name: 'Appointments', completion: metrics.appointmentCompletion },
  ];

  const chartConfig = {
    completion: {
      label: "Completion Rate",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-foreground" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">{data.portalName}</h1>
              <p className="text-muted-foreground">{data.projectDescription}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(data.status)} border`}>
            {data.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Client: {data.clientName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>{data.clientEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Last visited: {formatDate(data.lastVisited)}</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.modules.tasks && (
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Progress</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{tasks.length}</div>
              <p className="text-xs text-muted-foreground">
                {tasks.filter(t => t.status === 'completed').length} completed
              </p>
              <Progress value={metrics.taskCompletion} className="mt-2" />
            </CardContent>
          </Card>
        )}

        {data.modules.leads && (
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Lead Pipeline</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{leads.length}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(leads.reduce((sum, lead) => sum + (lead.value || 0), 0))} value
              </p>
              <Progress value={metrics.leadConversion} className="mt-2" />
            </CardContent>
          </Card>
        )}

        {data.modules.payments && (
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatCurrency(metrics.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(metrics.pendingRevenue)} pending
              </p>
              <Progress value={metrics.paymentCollection} className="mt-2" />
            </CardContent>
          </Card>
        )}

        {data.modules.appointments && (
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">
                {appointments.filter(a => a.status === 'completed').length} completed
              </p>
              <Progress value={metrics.appointmentCompletion} className="mt-2" />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Overview Summary */}
      {data.modules.overview && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {data.modules.overview.title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {data.modules.overview.summary}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Performance Chart using Shadcn Chart */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Module Performance</CardTitle>
          <CardDescription className="text-muted-foreground">
            Completion rates across all modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={trendData}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Line 
                type="monotone" 
                dataKey="completion" 
                stroke="var(--color-completion)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-completion)', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: 'var(--color-completion)' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-lg font-semibold text-foreground">Overall Health</div>
                <div className="text-sm text-muted-foreground">
                  {Math.round((metrics.taskCompletion + metrics.leadConversion + metrics.paymentCollection + metrics.appointmentCompletion) / 4)}% Average
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-lg font-semibold text-foreground">Cash Flow</div>
                <div className="text-sm text-muted-foreground">
                  {formatCurrency(metrics.totalRevenue + metrics.pendingRevenue)} Total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-lg font-semibold text-foreground">Activity Level</div>
                <div className="text-sm text-muted-foreground">
                  {tasks.length + leads.length + payments.length + appointments.length} Total Items
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewSection;