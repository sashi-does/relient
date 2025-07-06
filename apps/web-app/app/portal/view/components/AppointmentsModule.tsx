import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';

import { Plus, Calendar, User, Link, Clock, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/popover';
import { Calendar as CalendarComponent } from '@repo/ui/calender';
import { TimePicker } from '@repo/ui/time-picker';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Appointment } from '../Dashboard';
import { Button } from '@repo/ui/button';
import Input from '@repo/ui/input';
import { Badge } from '@repo/ui/badge';
import { Label } from '@repo/ui/label';
import { Textarea } from '@repo/ui/text-area';
import { toast } from 'sonner';
import { cn } from '@repo/ui/utils';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@repo/ui/select';

interface AppointmentsModuleProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

export const AppointmentsModule: React.FC<AppointmentsModuleProps> = ({
  appointments,
  setAppointments,
}) => {
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
  const [editAppointmentOpen, setEditAppointmentOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    client: '',
    date: '',
    time: '',
    status: 'scheduled' as Appointment['status'],
    notes: '',
    meetingUrl: '',
  });

  const handleAddAppointment = () => {
    if (!newAppointment.title.trim() || !newAppointment.client.trim() || !newAppointment.date || !newAppointment.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      title: newAppointment.title,
      client: newAppointment.client,
      date: newAppointment.date,
      time: newAppointment.time,
      status: newAppointment.status,
      notes: newAppointment.notes,
      meetingUrl: newAppointment.meetingUrl,
    };

    setAppointments(prev => [...prev, appointment]);
    setNewAppointment({
      title: '',
      client: '',
      date: '',
      time: '',
      status: 'scheduled',
      notes: '',
      meetingUrl: '',
    });
    setSelectedDate(undefined);
    setNewAppointmentOpen(false);

    toast({
      title: "Appointment Scheduled",
      description: "New appointment has been added successfully",
    });
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setNewAppointment({
      title: appointment.title,
      client: appointment.client,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      notes: appointment.notes || '',
      meetingUrl: appointment.meetingUrl || '',
    });
    setSelectedDate(new Date(appointment.date));
    setEditAppointmentOpen(true);
  };

  const handleUpdateAppointment = () => {
    if (!newAppointment.title.trim() || !newAppointment.client.trim() || !newAppointment.date || !newAppointment.time || !editingAppointment) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setAppointments(prev => prev.map(appointment =>
      appointment.id === editingAppointment.id ? {
        ...appointment,
        title: newAppointment.title,
        client: newAppointment.client,
        date: newAppointment.date,
        time: newAppointment.time,
        status: newAppointment.status,
        notes: newAppointment.notes,
        meetingUrl: newAppointment.meetingUrl,
      } : appointment
    ));

    setNewAppointment({
      title: '',
      client: '',
      date: '',
      time: '',
      status: 'scheduled',
      notes: '',
      meetingUrl: '',
    });
    setSelectedDate(undefined);
    setEditAppointmentOpen(false);
    setEditingAppointment(null);

    toast({
      title: "Appointment Updated",
      description: "Appointment has been updated successfully",
    });
  };

  const handleClearAll = () => {
    setAppointments([]);
    toast({
      title: "Appointments Cleared",
      description: "All appointments have been cleared",
    });
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const sortedAppointments = [...appointments].sort((a, b) => 
    new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Appointments</h2>
          <p className="text-muted-foreground">Schedule and manage client appointments</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClearAll} className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
          
          <Dialog open={newAppointmentOpen} onOpenChange={setNewAppointmentOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Schedule Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newAppointment.title}
                    onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                    placeholder="e.g., Discovery Call, Project Review"
                  />
                </div>
                
                <div>
                  <Label htmlFor="client">Client</Label>
                  <Input
                    id="client"
                    value={newAppointment.client}
                    onChange={(e) => setNewAppointment({ ...newAppointment, client: e.target.value })}
                    placeholder="Enter client name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setNewAppointment({ 
                              ...newAppointment, 
                              date: date ? format(date, "yyyy-MM-dd") : ''
                            });
                          }}
                          initialFocus
                          className="p-3 pointer-events-auto bg-popover border rounded-lg shadow-lg"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <TimePicker
                      value={newAppointment.time}
                      onValueChange={(time) => setNewAppointment({ ...newAppointment, time })}
                      placeholder="Select time"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="meetingUrl">Meeting URL</Label>
                  <Input
                    id="meetingUrl"
                    value={newAppointment.meetingUrl}
                    onChange={(e) => setNewAppointment({ ...newAppointment, meetingUrl: e.target.value })}
                    placeholder="https://meet.google.com/..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newAppointment.status} onValueChange={(value) => setNewAppointment({ ...newAppointment, status: value as Appointment['status'] })}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                    placeholder="Add any additional notes or agenda items"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNewAppointmentOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAppointment}>
                    Schedule
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={editAppointmentOpen} onOpenChange={setEditAppointmentOpen}>
        <DialogContent className="bg-popover max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={newAppointment.title}
                onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                placeholder="e.g., Discovery Call, Project Review"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-client">Client</Label>
              <Input
                id="edit-client"
                value={newAppointment.client}
                onChange={(e) => setNewAppointment({ ...newAppointment, client: e.target.value })}
                placeholder="Enter client name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setNewAppointment({ 
                          ...newAppointment, 
                          date: date ? format(date, "yyyy-MM-dd") : ''
                        });
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto bg-popover border rounded-lg shadow-lg"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="edit-time">Time</Label>
                <TimePicker
                  value={newAppointment.time}
                  onValueChange={(time) => setNewAppointment({ ...newAppointment, time })}
                  placeholder="Select time"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-meetingUrl">Meeting URL</Label>
              <Input
                id="edit-meetingUrl"
                value={newAppointment.meetingUrl}
                onChange={(e) => setNewAppointment({ ...newAppointment, meetingUrl: e.target.value })}
                placeholder="https://meet.google.com/..."
              />
            </div>
            
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={newAppointment.status} onValueChange={(value) => setNewAppointment({ ...newAppointment, status: value as Appointment['status'] })}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                placeholder="Add any additional notes or agenda items"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditAppointmentOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateAppointment}>
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedAppointments.map(appointment => (
          <Card key={appointment.id} className="hover:shadow-lg transition-shadow group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{appointment.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    {appointment.client}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditAppointment(appointment)}
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{appointment.time}</span>
              </div>

              {appointment.meetingUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <Link className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={appointment.meetingUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline truncate"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
              
              {appointment.notes && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {appointment.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {appointments.length === 0 && (
          <div className="col-span-full">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No appointments scheduled</h3>
                <p className="text-muted-foreground mb-4">Start by scheduling your first appointment</p>
                <Button onClick={() => setNewAppointmentOpen(true)}>
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};