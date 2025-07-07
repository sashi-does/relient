'use client'

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Plus, Upload, Search, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/dialog';
import { Label } from '@repo/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/table';
import { Lead } from '../dashboard';
// import * as XLSX from 'xlsx';
import { Button } from '@repo/ui/button';
import Input from '@repo/ui/input';
import { Badge } from '@repo/ui/badge';
import { toast } from 'sonner';

interface LeadsModuleProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

export const LeadsModule: React.FC<LeadsModuleProps> = ({
  leads,
  setLeads,
}) => {
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [editLeadOpen, setEditLeadOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'new' as Lead['status'],
    value: 0,
    source: '',
  });

  const handleAddLead = () => {
    if (!newLead.name.trim() || !newLead.email.trim()) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    const lead: Lead = {
      id: Date.now().toString(),
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      status: newLead.status,
      value: newLead.value,
      source: newLead.source,
    };

    setLeads(prev => [...prev, lead]);
    setNewLead({
      name: '',
      email: '',
      phone: '',
      status: 'new',
      value: 0,
      source: '',
    });
    setNewLeadOpen(false);

    toast({
      title: "Lead Added",
      description: "New lead has been added successfully",
    });
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setNewLead({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      status: lead.status,
      value: lead.value,
      source: lead.source || '',
    });
    setEditLeadOpen(true);
  };

  const handleUpdateLead = () => {
    if (!newLead.name.trim() || !newLead.email.trim() || !editingLead) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    setLeads(prev => prev.map(lead =>
      lead.id === editingLead.id ? {
        ...lead,
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        status: newLead.status,
        value: newLead.value,
        source: newLead.source,
      } : lead
    ));

    setNewLead({
      name: '',
      email: '',
      phone: '',
      status: 'new',
      value: 0,
      source: '',
    });
    setEditLeadOpen(false);
    setEditingLead(null);

    toast({
      title: "Lead Updated",
      description: "Lead has been updated successfully",
    });
  };

  const handleClearAll = () => {
    setLeads([]);
    toast({
      title: "Leads Cleared",
      description: "All leads have been cleared",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const newLeads: Lead[] = jsonData.map((row: any, index) => ({
          id: `imported-${Date.now()}-${index}`,
          name: row.Name || row.name || '',
          email: row.Email || row.email || '',
          phone: row.Phone || row.phone || '',
          status: 'new' as Lead['status'],
          value: Number(row.Value || row.value || 0),
          source: row.Source || row.source || 'Import',
        })).filter(lead => lead.name && lead.email);

        setLeads(prev => [...prev, ...newLeads]);
        
        toast({
          title: "Import Successful",
          description: `${newLeads.length} leads imported from Excel file`,
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to read Excel file. Please check the format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'qualified':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'converted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Lead Management</h2>
          <p className="text-muted-foreground">Track and manage your potential clients</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Button variant="outline" onClick={handleClearAll} className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import Excel
          </Button>
          
          <Dialog open={newLeadOpen} onOpenChange={setNewLeadOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="Enter lead name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={newLead.status} onValueChange={(value) => setNewLead({ ...newLead, status: value as Lead['status'] })}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="value">Value ($)</Label>
                    <Input
                      id="value"
                      type="number"
                      value={newLead.value}
                      onChange={(e) => setNewLead({ ...newLead, value: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                    placeholder="e.g., Website, Referral, Social Media"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNewLeadOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddLead}>
                    Add Lead
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={editLeadOpen} onOpenChange={setEditLeadOpen}>
        <DialogContent className="bg-popover">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                placeholder="Enter lead name"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={newLead.phone}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={newLead.status} onValueChange={(value) => setNewLead({ ...newLead, status: value as Lead['status'] })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-value">Value ($)</Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={newLead.value}
                  onChange={(e) => setNewLead({ ...newLead, value: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-source">Source</Label>
              <Input
                id="edit-source"
                value={newLead.source}
                onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                placeholder="e.g., Website, Referral, Social Media"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditLeadOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateLead}>
                Update Lead
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map(lead => (
                  <TableRow key={lead.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      ${lead.value.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {lead.source || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLead(lead)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLeads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No leads found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};