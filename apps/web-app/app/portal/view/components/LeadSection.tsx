'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import Input from '@repo/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/select';
import { TrendingUp, Users, DollarSign, Target, Search, Filter } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis } from 'recharts';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  value: number;
  source: string;
}

interface LeadsSectionProps {
  leads: Lead[];
}

const LeadsSection: React.FC<LeadsSectionProps> = ({ leads }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const leadStats = {
    total: leads.length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length,
    totalValue: leads.reduce((sum, lead) => sum + (lead.value || 0), 0),
  };

  const conversionRate = leadStats.total > 0 ? (leadStats.converted / leadStats.total) * 100 : 0;
  const avgLeadValue = leadStats.total > 0 ? leadStats.totalValue / leadStats.total : 0;

  const statusData = [
    { name: 'Contacted', value: leadStats.contacted, fill: 'hsl(var(--chart-2))' },
    { name: 'Converted', value: leadStats.converted, fill: 'hsl(var(--chart-1))' },
    { name: 'New', value: leadStats.total - leadStats.contacted - leadStats.converted, fill: 'hsl(var(--chart-3))' },
  ].filter(item => item.value > 0);

  const sourceData = leads.reduce((acc, lead) => {
    const source = lead.source || 'Unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceChartData = Object.entries(sourceData).map(([name, value]) => ({ 
    name, 
    value,
    fill: `hsl(var(--chart-${(Object.keys(sourceData).indexOf(name) % 5) + 1}))`
  }));

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const chartConfig = {
    contacted: {
      label: "Contacted",
      color: "hsl(var(--chart-2))",
    },
    converted: {
      label: "Converted",
      color: "hsl(var(--chart-1))",
    },
    new: {
      label: "New",
      color: "hsl(var(--chart-3))",
    },
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'converted': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'contacted': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header with Key Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">Leads</h2>
            <p className="text-sm lg:text-base text-muted-foreground">{leadStats.total} total leads</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-2xl lg:text-3xl font-bold text-foreground">{formatCurrency(leadStats.totalValue)}</div>
          <div className="text-xs lg:text-sm text-muted-foreground">Total Pipeline Value</div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-3 lg:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
              <Users className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              <div>
                <div className="text-lg lg:text-2xl font-bold text-foreground">{leadStats.total}</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Total Leads</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardContent className="p-3 lg:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
              <Target className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              <div>
                <div className="text-lg lg:text-2xl font-bold text-foreground">{conversionRate.toFixed(1)}%</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Conversion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardContent className="p-3 lg:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
              <DollarSign className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              <div>
                <div className="text-lg lg:text-2xl font-bold text-foreground">{formatCurrency(avgLeadValue)}</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Avg Lead Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardContent className="p-3 lg:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
              <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              <div>
                <div className="text-lg lg:text-2xl font-bold text-foreground">{leadStats.converted}</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Converted</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts using Shadcn Chart Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm lg:text-base text-card-foreground">Lead Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[200px] w-full">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
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
          <CardHeader className="pb-3">
            <CardTitle className="text-sm lg:text-base text-card-foreground">Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={sourceChartData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads with Filters */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base lg:text-lg text-card-foreground flex items-center gap-2">
            <Users className="h-4 w-4 lg:h-5 lg:w-5" />
            Recent Leads
          </CardTitle>
          <CardDescription className="text-xs lg:text-sm text-muted-foreground">
            Latest leads in your pipeline
          </CardDescription>
          
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
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
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLeads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/50 rounded-lg border border-border gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm lg:text-base text-foreground truncate">{lead.name}</h4>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">{lead.email}</p>
                  <p className="text-xs text-muted-foreground">Source: {lead.source}</p>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <p className="font-medium text-sm lg:text-base text-foreground">{formatCurrency(lead.value)}</p>
                  <Badge className={`${getStatusColor(lead.status)} border text-xs mt-1`}>
                    {lead.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsSection;