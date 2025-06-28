"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload } from "lucide-react"
import { Button } from "@repo/ui/button"
import Input from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (appointment: any) => void
  onImport: (file: File) => void
}

export function AppointmentModal({ isOpen, onClose, onSubmit, onImport }: AppointmentModalProps) {
  const [activeTab, setActiveTab] = useState<"manual" | "import">("manual")
  const [formData, setFormData] = useState({
    leadName: "",
    email: "",
    meetingDate: "",
    meetingTime: "",
    meetingLink: "",
    status: "scheduled",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.leadName.trim()) newErrors.leadName = "Lead name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.meetingDate) newErrors.meetingDate = "Meeting date is required"
    if (!formData.meetingTime) newErrors.meetingTime = "Meeting time is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
      setFormData({ leadName: "", email: "", meetingDate: "", meetingTime: "", meetingLink: "", status: "scheduled" })
      onClose()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImport(file)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-black border border-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add Appointment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex mb-6 bg-gray-900 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "manual" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "import" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Import Excel
          </button>
        </div>

        {activeTab === "manual" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="leadName" className="text-gray-300">
                Lead Name *
              </Label>
              <Input
                id="leadName"
                value={formData.leadName}
                onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                className="bg-gray-900 border-gray-700 text-white"
                placeholder="John Smith"
              />
              {errors.leadName && <p className="text-red-400 text-sm mt-1">{errors.leadName}</p>}
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

            <div>
              <Label className="text-gray-300">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
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
                Create Appointment
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Import Appointments</h3>
              <p className="text-gray-400 text-sm mb-4">
                Upload a CSV or Excel file with columns: Name, Email, Meeting Time, Meeting Link, Status
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button asChild className="bg-white hover:bg-gray-200 text-black">
                  <span>Choose File</span>
                </Button>
              </label>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Expected Format:</h4>
              <div className="text-xs text-gray-400 space-y-1">
                <div>• Name: Full name of the lead</div>
                <div>• Email: Contact email address</div>
                <div>• Meeting Time: YYYY-MM-DD HH:MM format</div>
                <div>• Meeting Link: Zoom/Meet URL or ID</div>
                <div>• Status: scheduled, completed, or no-show</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
