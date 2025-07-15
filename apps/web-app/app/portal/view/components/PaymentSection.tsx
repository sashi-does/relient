'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import { Button } from '@repo/ui/button';
import Input from '@repo/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/select';
import { DollarSign, CreditCard, TrendingUp, Calendar, Search, Filter } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis } from 'recharts';

interface Payment {
  id: string;
  client: string;
  amount: number;
  status: string;
  dueDate: string;
  invoiceNumber: string;
}

interface PaymentsSectionProps {
  payments: Payment[];
}

const PaymentsSection: React.FC<PaymentsSectionProps> = ({ payments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const paymentStats = {
    total: payments.length,
    totalAmount: payments.reduce((sum, payment) => sum + payment.amount, 0),
    pending: payments.filter(p => p.status === 'pending').length,
    paid: payments.filter(p => p.status === 'paid').length,
    overdue: payments.filter(p => p.status === 'overdue').length,
    pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    paidAmount: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
  };

  const collectionRate = paymentStats.totalAmount > 0 ? (paymentStats.paidAmount / paymentStats.totalAmount) * 100 : 0;

  const statusData = [
    { name: 'Paid', value: paymentStats.paid, fill: 'hsl(var(--chart-1))' },
    { name: 'Pending', value: paymentStats.pending, fill: 'hsl(var(--chart-2))' },
    { name: 'Overdue', value: paymentStats.overdue, fill: 'hsl(var(--chart-3))' },
  ].filter(item => item.value > 0);

  const amountData = [
    { name: 'Paid', amount: paymentStats.paidAmount },
    { name: 'Pending', amount: paymentStats.pendingAmount },
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      case 'paid': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'overdue': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handlePayment = (payment: Payment) => {
    console.log('Processing payment for:', payment.invoiceNumber);
  };

  const chartConfig = {
    paid: {
      label: "Paid",
      color: "hsl(var(--chart-1))",
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-2))",
    },
    overdue: {
      label: "Overdue",
      color: "hsl(var(--chart-3))",
    },
    amount: {
      label: "Amount",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header with Key Metrics */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-foreground" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Payments</h2>
            <p className="text-muted-foreground">{paymentStats.total} total payments</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-foreground">{formatCurrency(paymentStats.totalAmount)}</div>
          <div className="text-sm text-muted-foreground">Total Amount</div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-card-foreground">{formatCurrency(paymentStats.paidAmount)}</div>
                <div className="text-sm text-muted-foreground">Total Collected</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-card-foreground">{formatCurrency(paymentStats.pendingAmount)}</div>
                <div className="text-sm text-muted-foreground">Pending Amount</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-card-foreground">{collectionRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Collection Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-card-foreground">{paymentStats.paid}</div>
                <div className="text-sm text-muted-foreground">Paid Invoices</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts using Shadcn Chart Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Payment Status</CardTitle>
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
            <CardTitle className="text-card-foreground">Payment Amounts by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <BarChart data={amountData}>
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
                <Bar dataKey="amount" fill="var(--color-amount)" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payments List with Filters */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Recent Payments
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your invoices and payments
          </CardDescription>
          
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by client or invoice..."
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
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
                <div className="flex-1">
                  <h4 className="font-medium text-card-foreground">{payment.invoiceNumber}</h4>
                  <p className="text-sm text-muted-foreground">Client: {payment.client}</p>
                  <p className="text-xs text-muted-foreground">Due: {formatDate(payment.dueDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium text-card-foreground">{formatCurrency(payment.amount)}</p>
                    <Badge className={`${getStatusColor(payment.status)} border`}>
                      {payment.status}
                    </Badge>
                  </div>
                  {payment.status === 'pending' && (
                    <Button 
                      onClick={() => handlePayment(payment)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Pay Now
                    </Button>
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

export default PaymentsSection;