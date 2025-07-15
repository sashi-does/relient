'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import { Progress } from '@repo/ui/progress';
import Input from '@repo/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/select';
import { CheckCircle, FileText, AlertCircle, Clock, Search, Filter } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { Pie, PieChart, Cell, Bar, BarChart, XAxis, YAxis } from 'recharts';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

interface TasksSectionProps {
  tasks: Task[];
}

const TasksSection: React.FC<TasksSectionProps> = ({ tasks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  const completionRate = taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0;

  const statusData = [
    { name: 'Completed', value: taskStats.completed, fill: 'hsl(var(--chart-1))' },
    { name: 'In Progress', value: taskStats.inProgress, fill: 'hsl(var(--chart-2))' },
    { name: 'Pending', value: taskStats.pending, fill: 'hsl(var(--chart-3))' },
  ].filter(item => item.value > 0);

  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, fill: 'hsl(var(--chart-1))' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, fill: 'hsl(var(--chart-2))' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, fill: 'hsl(var(--chart-3))' },
  ].filter(item => item.value > 0);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const chartConfig = {
    completed: {
      label: "Completed",
      color: "hsl(var(--chart-1))",
    },
    inProgress: {
      label: "In Progress", 
      color: "hsl(var(--chart-2))",
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-3))",
    },
    high: {
      label: "High Priority",
      color: "hsl(var(--chart-1))",
    },
    medium: {
      label: "Medium Priority",
      color: "hsl(var(--chart-2))",
    },
    low: {
      label: "Low Priority", 
      color: "hsl(var(--chart-3))",
    },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'in-progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header with Key Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">Tasks</h2>
            <p className="text-sm lg:text-base text-muted-foreground">{taskStats.total} total tasks</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-2xl lg:text-3xl font-bold text-foreground">{completionRate.toFixed(0)}%</div>
          <div className="text-xs lg:text-sm text-muted-foreground">Completion Rate</div>
        </div>
      </div>

      {/* Charts and Metrics using Shadcn Chart Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm lg:text-base text-card-foreground">Task Status</CardTitle>
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
            <CardTitle className="text-sm lg:text-base text-card-foreground">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={priorityData}>
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

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm lg:text-base text-card-foreground">Progress Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 lg:space-y-4">
            <div>
              <div className="flex justify-between text-xs lg:text-sm mb-2">
                <span className="text-muted-foreground">Completed</span>
                <span className="text-foreground">{taskStats.completed}/{taskStats.total}</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-green-400" />
                <span className="text-xs lg:text-sm text-muted-foreground">Completed: {taskStats.completed}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 lg:h-4 lg:w-4 text-blue-400" />
                <span className="text-xs lg:text-sm text-muted-foreground">In Progress: {taskStats.inProgress}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-400" />
                <span className="text-xs lg:text-sm text-muted-foreground">Pending: {taskStats.pending}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks with Filters */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base lg:text-lg text-card-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
            Recent Tasks
          </CardTitle>
          <CardDescription className="text-xs lg:text-sm text-muted-foreground">
            Latest tasks and their current status
          </CardDescription>
          
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/50 rounded-lg border border-border gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm lg:text-base text-foreground truncate">{task.title}</h4>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">{task.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Due: {formatDate(task.dueDate)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge className={`${getPriorityColor(task.priority)} border text-xs`}>
                    {task.priority}
                  </Badge>
                  <Badge className={`${getStatusColor(task.status)} border text-xs`}>
                    {task.status}
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

export default TasksSection;