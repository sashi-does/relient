'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import Input from '@repo/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/select';
import { Clock, Calendar, User, Video, Search, Filter } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis } from 'recharts';

interface Appointment {
  id: string;
  title: string;
  client: string;
  date: string;
  time: string;
  status: string;
  meetingUrl: string;
}

interface AppointmentsSectionProps {
  appointments: Appointment[];
}

const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({ appointments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const appointmentStats = {
    total: appointments.length,
    completed: appointments.filter(a => a.status === 'completed').length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const completionRate = appointmentStats.total > 0 ? (appointmentStats.completed / appointmentStats.total) * 100 : 0;

  const statusData = [
    { name: 'Completed', value: appointmentStats.completed, fill: 'hsl(var(--chart-1))' },
    { name: 'Scheduled', value: appointmentStats.scheduled, fill: 'hsl(var(--chart-2))' },
    { name: 'Cancelled', value: appointmentStats.cancelled, fill: 'hsl(var(--chart-3))' },
  ].filter(item => item.value > 0);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'scheduled': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const chartConfig = {
    completed: {
      label: "Completed",
      color: "hsl(var(--chart-1))",
    },
    scheduled: {
      label: "Scheduled",
      color: "hsl(var(--chart-2))",
    },
    cancelled: {
      label: "Cancelled",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header with Key Metrics */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-foreground" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Appointments</h2>
            <p className="text-muted-foreground">{appointmentStats.total} total appointments</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-foreground">{completionRate.toFixed(0)}%</div>
          <div className="text-sm text-muted-foreground">Completion Rate</div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-card-foreground">{appointmentStats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-card-foreground">{appointmentStats.scheduled}</div>
                <div className="text-sm text-muted-foreground">Scheduled</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-card-foreground">{appointmentStats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-card-foreground">{appointmentStats.cancelled}</div>
                <div className="text-sm text-muted-foreground">Cancelled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts using Shadcn Chart Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Appointment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <BarChart data={statusData}>
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
                <Bar dataKey="value" fill="hsl(var(--chart-1))" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments with Filters */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Appointments
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your upcoming and recent appointments
          </CardDescription>
          
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border">
                <div className="flex-1">
                  <h4 className="font-medium text-card-foreground">{appointment.title}</h4>
                  <p className="text-sm text-muted-foreground">Client: {appointment.client}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(appointment.date)} at {appointment.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(appointment.status)} border`}>
                    {appointment.status}
                  </Badge>
                  {appointment.meetingUrl && appointment.status === 'scheduled' && (
                    <Video className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsSection;