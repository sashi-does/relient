"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload } from "lucide-react"
import { Button } from "@repo/ui/button"
import Input from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Textarea } from "@repo/ui/text-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payment: any) => void
}

export function PaymentModal({ isOpen, onClose, onSubmit }: PaymentModalProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    company: "",
    amount: "",
    dueDate: "",
    description: "",
    status: "pending",
    invoiceFile: null as File | null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.clientName.trim()) newErrors.clientName = "Client name is required"
    if (!formData.amount.trim()) newErrors.amount = "Amount is required"
    else if (isNaN(Number.parseFloat(formData.amount.replace(/[^0-9.-]/g, "")))) newErrors.amount = "Invalid amount"
    if (!formData.dueDate) newErrors.dueDate = "Due date is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
      setFormData({
        clientName: "",
        company: "",
        amount: "",
        dueDate: "",
        description: "",
        status: "pending",
        invoiceFile: null,
      })
      onClose()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, invoiceFile: file })
    }
  }

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "")
    if (numericValue) {
      return `$${Number.parseFloat(numericValue).toLocaleString()}`
    }
    return value
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-black border border-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Create Invoice</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clientName" className="text-gray-300">
              Client Name *
            </Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="John Smith"
            />
            {errors.clientName && <p className="text-red-400 text-sm mt-1">{errors.clientName}</p>}
          </div>

          <div>
            <Label htmlFor="company" className="text-gray-300">
              Company
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="Company Name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="amount" className="text-gray-300">
                Amount *
              </Label>
              <Input
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                onBlur={(e) => setFormData({ ...formData, amount: formatAmount(e.target.value) })}
                className="bg-gray-900 border-gray-700 text-white"
                placeholder="$2,500"
              />
              {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <Label htmlFor="dueDate" className="text-gray-300">
                Due Date *
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="bg-gray-900 border-gray-700 text-white"
              />
              {errors.dueDate && <p className="text-red-400 text-sm mt-1">{errors.dueDate}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="What is this payment for?"
              rows={3}
            />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label className="text-gray-300">Payment Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="invoiceFile" className="text-gray-300">
              Invoice File (Optional)
            </Label>
            <div className="mt-2">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="invoice-file-upload"
              />
              <label htmlFor="invoice-file-upload">
                <div className="flex items-center gap-2 p-3 border border-gray-700 rounded-md bg-gray-900 hover:bg-gray-800 cursor-pointer">
                  <Upload className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">
                    {formData.invoiceFile ? formData.invoiceFile.name : "Upload PDF or document"}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-white hover:bg-gray-200 text-black order-1 sm:order-2">
              Create Invoice
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
