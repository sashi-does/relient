"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@repo/ui/button"
import Input from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Textarea } from "@repo/ui/text-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (lead: any) => void
}

export function LeadModal({ isOpen, onClose, onSubmit }: LeadModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "cold",
    notes: "",
    meetingDate: "",
    meetingTime: "",
    meetingLink: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"

    if (formData.status === "meeting-booked") {
      if (!formData.meetingDate) newErrors.meetingDate = "Meeting date is required"
      if (!formData.meetingTime) newErrors.meetingTime = "Meeting time is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "cold",
        notes: "",
        meetingDate: "",
        meetingTime: "",
        meetingLink: "",
      })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-black border border-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Lead</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300">
              Full Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="John Smith"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-300">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="john@company.com"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-300">
              Phone Number *
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
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

          <div>
            <Label className="text-gray-300">Lead Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="cold">Cold</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="interested">Interested</SelectItem>
                <SelectItem value="meeting-booked">Meeting Booked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.status === "meeting-booked" && (
            <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <h3 className="text-sm font-medium text-gray-300">Meeting Details</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="meetingDate" className="text-gray-300">
                    Date *
                  </Label>
                  <Input
                    id="meetingDate"
                    type="date"
                    value={formData.meetingDate}
                    onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                  {errors.meetingDate && <p className="text-red-400 text-sm mt-1">{errors.meetingDate}</p>}
                </div>

                <div>
                  <Label htmlFor="meetingTime" className="text-gray-300">
                    Time *
                  </Label>
                  <Input
                    id="meetingTime"
                    type="time"
                    value={formData.meetingTime}
                    onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                  {errors.meetingTime && <p className="text-red-400 text-sm mt-1">{errors.meetingTime}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="meetingLink" className="text-gray-300">
                  Meeting Link/ID
                </Label>
                <Input
                  id="meetingLink"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white"
                  placeholder="Zoom/Meet link or ID"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="notes" className="text-gray-300">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="Additional notes..."
              rows={3}
            />
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
              Create Lead
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
