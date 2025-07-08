'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Label } from '@repo/ui/label';
import { Textarea } from '@repo/ui/text-area';
import { Plus, Trash2, FileText, Download, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/popover';
import { Calendar as CalendarComponent } from '@repo/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@repo/ui/utils';


import Input from '@repo/ui/input';
import { Button } from '@repo/ui/button';
import { toast } from 'sonner';


interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

export const InvoiceModule: React.FC = () => {
  const [selectedIssueDate, setSelectedIssueDate] = useState<Date>(new Date());
  const [selectedDueDate, setSelectedDueDate] = useState<Date>();
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    paymentFor: '',
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0, total: 0 }
  ]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.total = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxRate = 0.08; // 8% tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const generateInvoice = () => {
    if (!invoiceData.clientName || !invoiceData.clientEmail || !invoiceData.dueDate || !invoiceData.paymentFor) {
      toast.error("Please fill in all required client information and payment description");
      return;
    }

    if (items.some(item => !item.description || item.rate <= 0)) {
      toast.error("Please fill in all item details");
      return;
    }

    // In a real app, this would generate a PDF or send to backend
    toast.success(`Invoice ${invoiceData.invoiceNumber} has been created successfully`);
  };

  const downloadInvoice = () => {
    // In a real app, this would trigger PDF download
    toast.success("Invoice PDF download will begin shortly");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Create Invoice</h2>
          <p className="text-muted-foreground">Generate professional invoices for your clients</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadInvoice} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button onClick={generateInvoice} className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Generate Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={invoiceData.clientName}
                    onChange={(e) => setInvoiceData({ ...invoiceData, clientName: e.target.value })}
                    placeholder="Enter client name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="clientEmail">Client Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={invoiceData.clientEmail}
                    onChange={(e) => setInvoiceData({ ...invoiceData, clientEmail: e.target.value })}
                    placeholder="client@example.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="clientAddress">Client Address</Label>
                <Textarea
                  id="clientAddress"
                  value={invoiceData.clientAddress}
                  onChange={(e) => setInvoiceData({ ...invoiceData, clientAddress: e.target.value })}
                  placeholder="Enter client address"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedIssueDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedIssueDate}
                        onSelect={(date) => {
                          if (date) {
                            setSelectedIssueDate(date);
                            setInvoiceData({ 
                              ...invoiceData, 
                              issueDate: format(date, "yyyy-MM-dd")
                            });
                          }
                        }}
                        initialFocus
                        className="p-3 pointer-events-auto bg-popover border rounded-lg shadow-lg"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
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
                          setInvoiceData({ 
                            ...invoiceData, 
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

              <div>
                <Label htmlFor="paymentFor">Payment For *</Label>
                <Input
                  id="paymentFor"
                  value={invoiceData.paymentFor}
                  onChange={(e) => setInvoiceData({ ...invoiceData, paymentFor: e.target.value })}
                  placeholder="e.g., Web Development Services, Consulting"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={invoiceData.notes}
                  onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                  placeholder="Additional notes or payment terms"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Line Items</CardTitle>
              <Button size="sm" onClick={addItem} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-12 md:col-span-5">
                      <Label>Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    
                    <div className="col-span-4 md:col-span-2">
                      <Label>Qty</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="col-span-4 md:col-span-2">
                      <Label>Rate ($)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="col-span-3 md:col-span-2">
                      <Label>Total</Label>
                      <div className="h-10 flex items-center font-mono text-sm">
                        ${item.total.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="h-10 w-10 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax (8%):</span>
                  <span className="font-mono">${taxAmount.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="font-mono">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                <div>
                  <strong>Invoice #{invoiceData.invoiceNumber}</strong>
                </div>
                
                {invoiceData.clientName && (
                  <div>
                    <strong>Bill To:</strong><br />
                    {invoiceData.clientName}<br />
                    {invoiceData.clientEmail}
                  </div>
                )}

                {invoiceData.paymentFor && (
                  <div>
                    <strong>Payment For:</strong><br />
                    {invoiceData.paymentFor}
                  </div>
                )}
                
                <div>
                  <strong>Issue Date:</strong> {invoiceData.issueDate}<br />
                  <strong>Due Date:</strong> {invoiceData.dueDate || 'Not set'}
                </div>
                
                <div className="pt-2 border-t">
                  <strong>Total Amount: ${total.toFixed(2)}</strong>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};