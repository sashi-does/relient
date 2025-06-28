"use client"

import type React from "react"
import { useState } from "react"
import {
  BarChart3,
  Users,
  CheckSquare,
  Calendar,
  CreditCard,
  Save,
  FileX,
  Eye,
  Phone,
  Mail,
  Clock,
  Plus,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@repo/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card"

import { Badge } from "@repo/ui/badge"
import { TaskModal } from "../modules/task"
import { LeadModal } from "../modules/lead"
import { PaymentModal } from "../modules/payment"
import { AppointmentModal } from "../modules/appointment"
import { Toast } from "../ui/toast"
import { Switch } from "../ui/switch"

interface Module {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  enabled: boolean
  alwaysEnabled?: boolean
}

const initialModules: Module[] = [
  { id: "overview", name: "Overview", icon: BarChart3, enabled: true, alwaysEnabled: true },
  { id: "leads", name: "Leads", icon: Users, enabled: false },
  { id: "tasks", name: "Tasks", icon: CheckSquare, enabled: false },
  { id: "appointments", name: "Appointments", icon: Calendar, enabled: false },
  { id: "payments", name: "Payments", icon: CreditCard, enabled: false },
]

const initialDummyData = {
  leads: [
    {
      id: 1,
      name: "John Smith",
      email: "john@company.com",
      phone: "+1 (555) 123-4567",
      company: "Tech Corp",
      status: "New",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@startup.io",
      phone: "+1 (555) 987-6543",
      company: "StartupCo",
      status: "Qualified",
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike@business.com",
      phone: "+1 (555) 456-7890",
      company: "Business Inc",
      status: "Contacted",
    },
  ],
  tasks: [
    { id: 1, title: "Follow up with John Smith", status: "pending", priority: "high" },
    { id: 2, title: "Prepare proposal for Tech Corp", status: "in-progress", priority: "medium" },
    { id: 3, title: "Schedule demo call", status: "completed", priority: "low" },
    { id: 4, title: "Send contract to StartupCo", status: "pending", priority: "high" },
  ],
  appointments: [
    { id: 1, title: "Demo Call - Tech Corp", date: "2024-01-15", time: "10:00 AM", type: "Video Call" },
    { id: 2, title: "Strategy Meeting", date: "2024-01-16", time: "2:00 PM", type: "In-Person" },
    { id: 3, title: "Follow-up Call", date: "2024-01-17", time: "11:30 AM", type: "Phone Call" },
  ],
  payments: [
    { id: 1, invoice: "INV-001", amount: "$2,500", dueDate: "2024-01-20", status: "Pending" },
    { id: 2, invoice: "INV-002", amount: "$1,800", dueDate: "2024-01-15", status: "Paid" },
    { id: 3, invoice: "INV-003", amount: "$3,200", dueDate: "2024-01-25", status: "Overdue" },
  ],
}

export default function PortalBuilderDashboard() {
  const [modules, setModules] = useState<Module[]>(initialModules)
  const [selectedModule, setSelectedModule] = useState<string>("overview")
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [dummyData, setDummyData] = useState(initialDummyData)
  const [toast, setToast] = useState<{ title: string; description: string; variant: "success" | "error" } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleModule = (moduleId: string) => {
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId && !module.alwaysEnabled ? { ...module, enabled: !module.enabled } : module,
      ),
    )
  }

  const enabledModules = modules.filter((module) => module.enabled)
  const enabledCount = enabledModules.length

  // Handler functions for adding new data
  const handleAddTask = (taskData: any) => {
    const newTask = { ...taskData, id: Date.now() }
    setDummyData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }))
    setToast({ title: "✅ Task Created", description: "New task has been added successfully", variant: "success" })
  }

  const handleAddLead = (leadData: any) => {
    const newLead = { ...leadData, id: Date.now() }
    setDummyData((prev) => ({
      ...prev,
      leads: [...prev.leads, newLead],
    }))

    // Auto-create appointment if meeting is booked
    if (leadData.status === "meeting-booked" && leadData.meetingDate) {
      const newAppointment = {
        id: Date.now() + 1,
        title: `Meeting - ${leadData.name}`,
        date: leadData.meetingDate,
        time: leadData.meetingTime,
        type: "Video Call",
        leadName: leadData.name,
        email: leadData.email,
        meetingLink: leadData.meetingLink,
        status: "scheduled",
      }
      setDummyData((prev) => ({
        ...prev,
        appointments: [...prev.appointments, newAppointment],
      }))
    }

    setToast({ title: "✅ Lead Created", description: "New lead has been added successfully", variant: "success" })
  }

  const handleAddAppointment = (appointmentData: any) => {
    const newAppointment = { ...appointmentData, id: Date.now() }
    setDummyData((prev) => ({
      ...prev,
      appointments: [...prev.appointments, newAppointment],
    }))
    setToast({ title: "✅ Appointment Created", description: "New appointment has been scheduled", variant: "success" })
  }

  const handleAddPayment = (paymentData: any) => {
    const newPayment = { ...paymentData, id: Date.now(), invoice: `INV-${String(Date.now()).slice(-3)}` }
    setDummyData((prev) => ({
      ...prev,
      payments: [...prev.payments, newPayment],
    }))
    setToast({
      title: "✅ Invoice Created",
      description: "New invoice has been created successfully",
      variant: "success",
    })
  }

  const handleImportAppointments = (file: File) => {
    setToast({ title: "📥 Import Started", description: "Processing your file...", variant: "success" })
  }

  const renderModuleContent = () => {
    const module = modules.find((m) => m.id === selectedModule)
    if (!module || !module.enabled) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
          <FileX className="w-12 h-12 sm:w-16 sm:h-16 mb-4 text-gray-500" />
          <h3 className="text-lg sm:text-xl font-medium mb-2 text-gray-300">No Module Selected</h3>
          <p className="text-sm sm:text-base text-center text-gray-500">
            Select an enabled module from the preview to view its content
          </p>
        </div>
      )
    }

    switch (selectedModule) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Leads</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white">{dummyData.leads.length}</p>
                      <p className="text-xs text-gray-500 mt-1">+2 from last week</p>
                    </div>
                    <div className="p-3 rounded-full bg-gray-800/50">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Active Tasks</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white">
                        {dummyData.tasks.filter((t) => t.status !== "completed").length}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">3 high priority</p>
                    </div>
                    <div className="p-3 rounded-full bg-gray-800/50">
                      <CheckSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Upcoming Meetings</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white">{dummyData.appointments.length}</p>
                      <p className="text-xs text-gray-500 mt-1">1 tomorrow</p>
                    </div>
                    <div className="p-3 rounded-full bg-gray-800/50">
                      <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Pending Payments</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white">
                        {dummyData.payments.filter((p) => p.status !== "Paid").length}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">$5,700 total</p>
                    </div>
                    <div className="p-3 rounded-full bg-gray-800/50">
                      <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg sm:text-xl flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      icon: <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex-shrink-0"></div>,
                      text: `New lead added: ${dummyData.leads[dummyData.leads.length - 1]?.name || "John Smith"}`,
                      time: "Just now",
                    },
                    {
                      icon: <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0"></div>,
                      text: "Task completed: Follow up call",
                      time: "30 min ago",
                    },
                    {
                      icon: <div className="w-2.5 h-2.5 bg-amber-500 rounded-full flex-shrink-0"></div>,
                      text: "Payment received: $2,500",
                      time: "2 hours ago",
                    },
                    {
                      icon: <div className="w-2.5 h-2.5 bg-purple-500 rounded-full flex-shrink-0"></div>,
                      text: "Meeting scheduled with Sarah Johnson",
                      time: "Yesterday",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      {item.icon}
                      <div className="flex-1">
                        <p className="text-gray-300 group-hover:text-white transition-colors">{item.text}</p>
                        <p className="text-xs text-gray-500">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "leads":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">Lead Management</h3>
                <p className="text-sm text-gray-400">Track and manage your potential clients</p>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white gap-2 w-full sm:w-auto"
                onClick={() => setActiveModal("lead")}
              >
                <Plus className="w-4 h-4" />
                Add Lead
              </Button>
            </div>
            <div className="space-y-4">
              {dummyData.leads.map((lead) => (
                <Card key={lead.id} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white">
                            {lead.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{lead.name}</h4>
                            <p className="text-sm text-gray-400">{lead.company}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 flex-shrink-0 text-gray-500" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 flex-shrink-0 text-gray-500" />
                            <span>{lead.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-3">
                        <Badge
                          variant="outline"
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            lead.status === "New"
                              ? "bg-blue-900/30 text-blue-300 border-blue-800"
                              : lead.status === "Qualified"
                                ? "bg-emerald-900/30 text-emerald-300 border-emerald-800"
                                : "bg-gray-800 text-gray-300 border-gray-700"
                          }`}
                        >
                          {lead.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs h-8">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-8">
                            Convert
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "tasks":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">Task Management</h3>
                <p className="text-sm text-gray-400">Track your to-dos and priorities</p>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white gap-2 w-full sm:w-auto"
                onClick={() => setActiveModal("task")}
              >
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </div>
            <div className="space-y-4">
              {dummyData.tasks.map((task) => (
                <Card key={task.id} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            task.status === "completed"
                              ? "bg-emerald-500"
                              : task.status === "in-progress"
                                ? "bg-blue-500"
                                : "bg-gray-500"
                          }`}
                        ></div>
                        <div>
                          <span className="text-white text-sm sm:text-base">{task.title}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">Due: Jan 15</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">Assigned to you</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            task.priority === "high"
                              ? "bg-red-900/30 text-red-300 border-red-800"
                              : task.priority === "medium"
                                ? "bg-amber-900/30 text-amber-300 border-amber-800"
                                : "bg-gray-800 text-gray-300 border-gray-700"
                          }`}
                        >
                          {task.priority}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                            task.status === "completed"
                              ? "bg-emerald-900/30 text-emerald-300 border-emerald-800"
                              : task.status === "in-progress"
                                ? "bg-blue-900/30 text-blue-300 border-blue-800"
                                : "bg-gray-800 text-gray-300 border-gray-700"
                          }`}
                        >
                          {task.status.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "appointments":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">Appointments</h3>
                <p className="text-sm text-gray-400">Manage your scheduled meetings</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => setActiveModal("appointment")}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Schedule
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-8">
                  Import
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              {dummyData.appointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="space-y-3 flex-1">
                        <h4 className="font-medium text-white">{appointment.title}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 flex-shrink-0 text-gray-500" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0 text-gray-500" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 flex-shrink-0 text-gray-500" />
                            <span>2 attendees</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-3">
                        <Badge
                          variant="outline"
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.type === "Video Call"
                              ? "bg-purple-900/30 text-purple-300 border-purple-800"
                              : appointment.type === "In-Person"
                                ? "bg-amber-900/30 text-amber-300 border-amber-800"
                                : "bg-gray-800 text-gray-300 border-gray-700"
                          }`}
                        >
                          {appointment.type}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs h-8">
                            Details
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-8">
                            Join
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "payments":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">Payment Management</h3>
                <p className="text-sm text-gray-400">Track invoices and payments</p>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white gap-2 w-full sm:w-auto"
                onClick={() => setActiveModal("payment")}
              >
                <Plus className="w-4 h-4" />
                Create Invoice
              </Button>
            </div>
            <div className="space-y-4">
              {dummyData.payments.map((payment) => (
                <Card key={payment.id} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-medium text-white">{payment.invoice}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <p>Due: {payment.dueDate}</p>
                          <p>•</p>
                          <p>Client: {dummyData.leads[0]?.name || "John Smith"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-white">{payment.amount}</span>
                        <Badge
                          variant="outline"
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            payment.status === "Paid"
                              ? "bg-emerald-900/30 text-emerald-300 border-emerald-800"
                              : payment.status === "Overdue"
                                ? "bg-red-900/30 text-red-300 border-red-800"
                                : "bg-amber-900/30 text-amber-300 border-amber-800"
                          }`}
                        >
                          {payment.status}
                        </Badge>
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Left Panel Component
  const LeftPanel = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4 text-white">Available Modules</h2>
        <div className="space-y-3">
          {modules.map((module) => {
            const IconComponent = module.icon
            return (
              <div
                key={module.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-800">
                    <IconComponent className="w-5 h-5 text-gray-400" />
                  </div>
                  <span className="text-white">{module.name}</span>
                </div>

                <Switch
                  checked={module.enabled}
                  onCheckedChange={() => toggleModule(module.id)}
                  disabled={module.alwaysEnabled}
                  className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-700"
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            <span className="font-medium text-white">{enabledCount}</span> modules selected
          </p>
          <Button variant="outline" size="sm" className="text-xs h-8">
            Reset Defaults
          </Button>
        </div>
      </div>
    </div>
  )

  // Preview Panel Component
  const PreviewPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-gray-800">
          <Eye className="w-5 h-5 text-gray-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Live Preview</h2>
      </div>

      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-400">Client Portal Sidebar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {enabledModules.map((module) => {
            const IconComponent = module.icon
            return (
              <button
                key={module.id}
                onClick={() => {
                  setSelectedModule(module.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${
                  selectedModule === module.id
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                    : "hover:bg-gray-800 text-gray-300 hover:text-white"
                }`}
                title={`View ${module.name} content`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm">{module.name}</span>
              </button>
            )
          })}

          {enabledModules.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileX className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No modules enabled</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Portal Builder</h1>
                <p className="text-gray-400 mt-1 text-sm sm:text-base hidden sm:block">
                  Customize your client portal experience
                </p>
              </div>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white gap-2 text-sm sm:text-base"
              onClick={() =>
                setToast({
                  title: "💾 Portal Saved",
                  description: "Your portal configuration has been saved successfully",
                  variant: "success",
                })
              }
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save Portal</span>
              <span className="sm:hidden">Save</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)] relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Panel - Available Modules */}
        <div
          className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
          w-80 border-r border-gray-800 bg-gray-900/95 lg:bg-gray-900/50 p-6
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <LeftPanel />
        </div>

        {/* Middle Panel - Live Preview (Hidden on mobile, shown on tablet+) */}
        <div className="hidden md:block w-80 lg:w-80 border-r border-gray-800 bg-gray-900/30 p-6">
          <PreviewPanel />
        </div>

        {/* Right Panel - Content Section */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Mobile Preview Panel */}
          <div className="md:hidden mb-6">
            <PreviewPanel />
          </div>
          {renderModuleContent()}
        </div>
      </div>

      {/* Modals */}
      <TaskModal isOpen={activeModal === "task"} onClose={() => setActiveModal(null)} onSubmit={handleAddTask} />
      <LeadModal isOpen={activeModal === "lead"} onClose={() => setActiveModal(null)} onSubmit={handleAddLead} />
      <AppointmentModal
        isOpen={activeModal === "appointment"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleAddAppointment}
        onImport={handleImportAppointments}
      />
      <PaymentModal
        isOpen={activeModal === "payment"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleAddPayment}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}