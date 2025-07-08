'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Plus, DollarSign, Calendar, AlertCircle, CalendarIcon, Upload, FileSpreadsheet, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/popover';
import { Calendar as CalendarComponent } from '@repo/ui/calendar';
import { format } from 'date-fns';
import { Payment } from '../dashboard';
import * as XLSX from 'xlsx';
import Input from '@repo/ui/input';
import { Button } from '@repo/ui/button';
import { Badge } from '@repo/ui/badge';
import { toast } from 'sonner';
import { cn } from '@repo/ui/utils';
import { Label } from '@repo/ui/label';

type PaymentRow = {
  [key: string]: string | number | undefined;
};

interface PaymentsModuleProps {
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
}

export const PaymentsModule: React.FC<PaymentsModuleProps> = ({
  payments,
  setPayments,
}) => {
  const [newPaymentOpen, setNewPaymentOpen] = useState(false);
  const [editPaymentOpen, setEditPaymentOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedDueDate, setSelectedDueDate] = useState<Date>();
  const [editSelectedDueDate, setEditSelectedDueDate] = useState<Date>();
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [newPayment, setNewPayment] = useState({
    client: '',
    amount: 0,
    status: 'pending' as Payment['status'],
    dueDate: '',
  });

  const handleAddPayment = () => {
    if (!newPayment.client.trim() || newPayment.amount <= 0 || !newPayment.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payment: Payment = {
      id: Date.now().toString(),
      client: newPayment.client,
      amount: newPayment.amount,
      status: newPayment.status,
      dueDate: newPayment.dueDate,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    };

    setPayments(prev => [...prev, payment]);
    setNewPayment({
      client: '',
      amount: 0,
      status: 'pending',
      dueDate: '',
    });
    setSelectedDueDate(undefined);
    setNewPaymentOpen(false);

    toast.success("New payment record has been created successfully");
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setEditSelectedDueDate(new Date(payment.dueDate));
    setEditPaymentOpen(true);
  };

  const handleUpdatePayment = () => {
    if (!editingPayment) return;

    if (!editingPayment.client.trim() || editingPayment.amount <= 0 || !editingPayment.dueDate) {
      toast.error( "Please fill in all required fields");
      return;
    }

    setPayments(prev =>
      prev.map(payment =>
        payment.id === editingPayment.id ? editingPayment : payment
      )
    );

    setEditPaymentOpen(false);
    setEditingPayment(null);
    setEditSelectedDueDate(undefined);

    toast("Payment has been updated successfully");
  };

  const handleDeletePayment = (paymentId: string) => {
    setPayments(prev => prev.filter(payment => payment.id !== paymentId));
    toast.success("Payment has been removed successfully");
  };

  const handleClearAll = () => {
    setPayments([]);
    toast.success("All payment records have been removed");
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          toast.error("No sheets found in the Excel file.");
          return;
        }
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          toast.error("No worksheet found in the Excel file.");
          return;
        }
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as PaymentRow[];

        const importedPayments: Payment[] = [];
        
        jsonData.forEach((row: PaymentRow, index: number) => {
          try {
            const paymentFor = row['Payment For'] || row['payment for'] || row['Client'] || row['client'] || '';
            const amount = parseFloat(String(row['Amount'] || row['amount'] || '0'));
            const dueDate = row['Due Date'] || row['due date'] || row['DueDate'] || '';
            const status = ((row['Status'] || row['status'] || 'pending') as string).toLowerCase();

            if (paymentFor && amount > 0 && dueDate) {
              // Try to parse different date formats
              let formattedDate = '';
              if (dueDate) {
                try {
                  const date = new Date(dueDate);
                  if (!isNaN(date.getTime())) {
                    formattedDate = format(date, 'yyyy-MM-dd');
                  }
                } catch {
                  // If date parsing fails, use as is
                  formattedDate = dueDate.toString();
                }
              }

              const payment: Payment = {
                id: `import-${Date.now()}-${index}`,
                client: String(paymentFor),
                amount: amount,
                status: ['pending', 'paid', 'overdue'].includes(status) ? status as Payment['status'] : 'pending',
                dueDate: formattedDate,
                invoiceNumber: `INV-${Date.now().toString().slice(-6)}-${index}`,
              };

              importedPayments.push(payment);
            }
          } catch (error) {
            console.log(`Error processing row ${index + 1}:`, error);
          }
        });

        if (importedPayments.length > 0) {
          setPayments(prev => [...prev, ...importedPayments]);
          toast.success(`Successfully imported ${importedPayments.length} payment records`);
        } else {
          toast("No valid payment records found in the file");
        }
      } catch (error) {
        toast( "Failed to process the Excel file. Please check the format.");
        console.log(error)
      }
    };
    reader.readAsArrayBuffer(file);
    setImportDialogOpen(false);
  };

  const updatePaymentStatus = (paymentId: string, newStatus: Payment['status']) => {
    setPayments(prev =>
      prev.map(payment =>
        payment.id === paymentId ? { ...payment, status: newStatus } : payment
      )
    );

    toast(`Payment status changed to ${newStatus}`);
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const isOverdue = (dueDate: string, status: Payment['status']) => {
    return status === 'pending' && new Date(dueDate) < new Date();
  };

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const overdueCount = payments.filter(p => isOverdue(p.dueDate, p.status)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payments</h2>
          <p className="text-muted-foreground">Track invoices and payment status</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleClearAll} variant="outline" className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>

          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import Excel
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover">
              <DialogHeader>
                <DialogTitle>Import Payments from Excel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-4">
                    Upload an Excel file with columns: Payment For, Amount, Due Date, Status
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileImport}
                    className="hidden"
                    id="excel-upload"
                  />
                  <Label htmlFor="excel-upload" className="cursor-pointer">
                    <Button type="button" className="pointer-events-none">
                      Choose File
                    </Button>
                  </Label>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>Expected columns:</strong></p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Payment For (required)</li>
                    <li>Amount (required)</li>
                    <li>Due Date (required)</li>
                    <li>Status (optional: pending, paid, overdue)</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={newPaymentOpen} onOpenChange={setNewPaymentOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover">
              <DialogHeader>
                <DialogTitle>Add New Payment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="paymentFor">Payment For What</Label>
                  <Input
                    id="paymentFor"
                    value={newPayment.client}
                    onChange={(e) => setNewPayment({ ...newPayment, client: e.target.value })}
                    placeholder="Enter what this payment is for"
                  />
                </div>
                
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={newPayment.status} onValueChange={(value) => setNewPayment({ ...newPayment, status: value as Payment['status'] })}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDueDate ? format(selectedDueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDueDate}
                          onSelect={(date) => {
                            setSelectedDueDate(date);
                            setNewPayment({ 
                              ...newPayment, 
                              dueDate: date ? format(date, "yyyy-MM-dd") : ''
                            });
                          }}
                          initialFocus
                          className="p-3 pointer-events-auto bg-popover border rounded-lg shadow-lg"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNewPaymentOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPayment}>
                    Add Payment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Payment Dialog */}
      <Dialog open={editPaymentOpen} onOpenChange={setEditPaymentOpen}>
        <DialogContent className="bg-popover">
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
          </DialogHeader>
          {editingPayment && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editPaymentFor">Payment For What</Label>
                <Input
                  id="editPaymentFor"
                  value={editingPayment.client}
                  onChange={(e) => setEditingPayment({ ...editingPayment, client: e.target.value })}
                  placeholder="Enter what this payment is for"
                />
              </div>
              
              <div>
                <Label htmlFor="editAmount">Amount ($)</Label>
                <Input
                  id="editAmount"
                  type="number"
                  value={editingPayment.amount}
                  onChange={(e) => setEditingPayment({ ...editingPayment, amount: Number(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editStatus">Status</Label>
                  <Select value={editingPayment.status} onValueChange={(value) => setEditingPayment({ ...editingPayment, status: value as Payment['status'] })}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="editDueDate">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editSelectedDueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editSelectedDueDate ? format(editSelectedDueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={editSelectedDueDate}
                        onSelect={(date) => {
                          setEditSelectedDueDate(date);
                          setEditingPayment({ 
                            ...editingPayment, 
                            dueDate: date ? format(date, "yyyy-MM-dd") : ''
                          });
                        }}
                        initialFocus
                        className="p-3 pointer-events-auto bg-popover border rounded-lg shadow-lg"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditPaymentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdatePayment}>
                  Update Payment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {payments.filter(p => p.status === 'pending').length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {payments.filter(p => p.status === 'paid').length} payments received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Payments ({payments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Payment For What</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map(payment => (
                  <TableRow key={payment.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">
                      {payment.invoiceNumber}
                    </TableCell>
                    <TableCell className="font-medium">{payment.client}</TableCell>
                    <TableCell className="font-mono">
                      ${payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {new Date(payment.dueDate).toLocaleDateString()}
                        {isOverdue(payment.dueDate, payment.status) && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPayment(payment)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeletePayment(payment.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {payment.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePaymentStatus(payment.id, 'paid')}
                          >
                            Mark Paid
                          </Button>
                        )}
                        {payment.status === 'paid' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePaymentStatus(payment.id, 'pending')}
                          >
                            Mark Pending
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No payments found
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