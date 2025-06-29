"use client"

import React, { useState, useCallback, useMemo } from "react"
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
  Building,
  Clock,
  Plus,
  Menu,
  X,
  RotateCcw,
  Loader2,
} from "lucide-react"
import { Button } from "@repo/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@repo/ui/badge"
import { TaskModal } from "../modules/task"
import { LeadModal } from "../modules/lead"
import { AppointmentModal } from "../modules/appointment"
import { PaymentModal } from "../modules/payment"
import { Toast } from "../ui/toast"

interface Module {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  enabled: boolean
  alwaysEnabled?: boolean
}

interface Lead {
  id: number
  name: string
  email: string
  phone: string
  company: string
  status: string
}

interface Task {
  id: number
  title: string
  status: string
  priority: string
}

interface Appointment {
  id: number
  title: string
  date: string
  time: string
  type: string
}

interface Payment {
  id: number
  invoice: string
  amount: string
  dueDate: string
  status: string
}

interface DummyData {
  leads: Lead[]
  tasks: Task[]
  appointments: Appointment[]
  payments: Payment[]
}

interface ToastMessage {
  title: string
  description: string
  variant: "success" | "error"
}

interface PortalBuilderDashboardProps {
  portalId: string
}

const initialModules: Module[] = [
  { id: "overview", name: "Overview", icon: BarChart3, enabled: true, alwaysEnabled: true },
  { id: "leads", name: "Leads", icon: Users, enabled: false },
  { id: "tasks", name: "Tasks", icon: CheckSquare, enabled: false },
  { id: "appointments", name: "Appointments", icon: Calendar, enabled: false },
  { id: "payments", name: "Payments", icon: CreditCard, enabled: false },
]

const initialDummyData: DummyData = {
  leads: [
    { id: 1, name: "John Smith", email: "john@company.com", phone: "+1 (555) 123-4567", company: "Tech Corp", status: "New" },
    { id: 2, name: "Sarah Johnson", email: "sarah@startup.io", phone: "+1 (555) 987-6543", company: "StartupCo", status: "Qualified" },
    { id: 3, name: "Mike Davis", email: "mike@business.com", phone: "+1 (555) 456-7890", company: "Business Inc", status: "Contacted" },
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

const savePortal = async (portalId: string, modules: Module[], data: DummyData) => {
  try {
    const response = await fetch("/api/portal", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portalId, modules, data }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to save portal")
    }
    return true
  } catch (error) {
    console.error("Error saving portal:", error)
    return false
  }
}

const PortalBuilderDashboard: React.FC<PortalBuilderDashboardProps> = ({ portalId }) => {
  const [modules, setModules] = useState<Module[]>(initialModules)
  const [selectedModule, setSelectedModule] = useState<string>("overview")
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [dummyData, setDummyData] = useState<DummyData>(initialDummyData)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const enabledModules = useMemo(() => modules.filter((module) => module.enabled), [modules])
  const enabledCount = enabledModules.length

  const toggleModule = useCallback((moduleId: string) => {
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId && !module.alwaysEnabled ? { ...module, enabled: !module.enabled } : module
      )
    )
  }, [])

  const handleAddTask = useCallback((taskData: Task) => {
    const newTask = { ...taskData, id: Date.now() }
    setDummyData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }))
    setToast({ title: "✅ Task Created", description: "New task has been added successfully", variant: "success" })
    setActiveModal(null)
  }, [])

  const handleAddLead = useCallback((leadData: Lead & { meetingDate?: string; meetingTime?: string; meetingLink?: string }) => {
    const newLead = { ...leadData, id: Date.now() }
    setDummyData((prev) => {
      const newData = { ...prev, leads: [...prev.leads, newLead] }
      if (leadData.status === "meeting-booked" && leadData.meetingDate && leadData.meetingTime) {
        return {
          ...newData,
          appointments: [
            ...prev.appointments,
            {
              id: Date.now() + 1,
              title: `Meeting - ${leadData.name}`,
              date: leadData.meetingDate,
              time: leadData.meetingTime,
              type: "Video Call",
              leadName: leadData.name,
              email: leadData.email,
              meetingLink: leadData.meetingLink,
              status: "scheduled",
            },
          ],
        }
      }
      return newData
    })
    setToast({ title: "✅ Lead Created", description: "New lead has been added successfully", variant: "success" })
    setActiveModal(null)
  }, [])

  const handleAddAppointment = useCallback((appointmentData: Appointment) => {
    const newAppointment = { ...appointmentData, id: Date.now() }
    setDummyData((prev) => ({
      ...prev,
      appointments: [...prev.appointments, newAppointment],
    }))
    setToast({ title: "✅ Appointment Created", description: "New appointment has been scheduled", variant: "success" })
    setActiveModal(null)
  }, [])

  const handleAddPayment = useCallback((paymentData: Payment) => {
    const newPayment = { ...paymentData, id: Date.now(), invoice: `INV-${String(Date.now()).slice(-3)}` }
    setDummyData((prev) => ({
      ...prev,
      payments: [...prev.payments, newPayment],
    }))
    setToast({ title: "✅ Invoice Created", description: "New invoice has been created successfully", variant: "success" })
    setActiveModal(null)
  }, [])

  const handleImportAppointments = useCallback((file: File) => {
    setToast({ title: "📥 Import Started", description: "Processing your file...", variant: "success" })
  }, [])

  const handleReset = useCallback(() => {
    setModules(initialModules)
    setSelectedModule("overview")
    setDummyData(initialDummyData)
    setActiveModal(null)
    setToast(null)
    setSidebarOpen(false)
    setTimeout(() => {
      setToast({ title: "🔄 Reset Complete", description: "All modules and data have been reset to default", variant: "success" })
    }, 100)
  }, [])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    const success = await savePortal(portalId, modules, dummyData)
    setToast({
      title: success ? "✅ Portal Saved" : "❌ Save Failed",
      description: success ? "Portal configuration saved successfully" : "Failed to save portal configuration",
      variant: success ? "success" : "error",
    })
    setIsSaving(false)
  }, [portalId, modules, dummyData])

  const renderModuleContent = useCallback(() => {
    const module = modules.find((m) => m.id === selectedModule)
    if (!module || !module.enabled) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 animate-in fade-in" role="alert">
          <FileX className="w-12 h-12 sm:w-16 sm:h-16 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">No Module Selected</h3>
          <p className="text-sm text-center">Select an enabled module from the preview to view its content</p>
        </div>
      )
    }

    switch (selectedModule) {
      case "overview":
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-300 font-medium">Total Leads</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{dummyData.leads.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-400" aria-hidden="true" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-300 font-medium">Active Tasks</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
                        {dummyData.tasks.filter((t) => t.status !== "completed").length}
                      </p>
                    </div>
                    <CheckSquare className="w-8 h-8 text-green-400" aria-hidden="true" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg sm:text-xl font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" aria-hidden="true"></div>
                    <span className="text-gray-200 text-sm">
                      New lead added: {dummyData.leads[dummyData.leads.length - 1]?.name || "John Smith"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" aria-hidden="true"></div>
                    <span className="text-gray-200 text-sm">Task completed: Follow up call</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0" aria-hidden="true"></div>
                    <span className="text-gray-200 text-sm">Payment received: $2,500</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "leads":
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h3 className="text-xl font-semibold text-white">Lead Management</h3>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white gap-2 w-full sm:w-auto transition-all duration-200"
                onClick={() => setActiveModal("lead")}
                aria-label="Add new lead"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Add Lead
              </Button>
            </div>
            <div className="space-y-3">
              {dummyData.leads.map((lead) => (
                <Card key={lead.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="space-y-2 flex-1">
                        <h4 className="font-medium text-white">{lead.name}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-300">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            <span>{lead.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            <span>{lead.company}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={lead.status === "New" ? "default" : "outline"}
                        className={`self-start ${
                          lead.status === "New"
                            ? "bg-blue-500 text-white"
                            : lead.status === "Qualified"
                              ? "bg-gray-700 text-white"
                              : "bg-gray-800 text-gray-300"
                        }`}
                      >
                        {lead.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "tasks":
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h3 className="text-xl font-semibold text-white">Task Management</h3>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white gap-2 w-full sm:w-auto transition-all duration-200"
                onClick={() => setActiveModal("task")}
                aria-label="Add new task"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Add Task
              </Button>
            </div>
            <div className="space-y-3">
              {dummyData.tasks.map((task) => (
                <Card key={task.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            task.status === "completed"
                              ? "bg-green-400"
                              : task.status === "in-progress"
                                ? "bg-yellow-400"
                                : "bg-red-400"
                          }`}
                          aria-hidden="true"
                        ></div>
                        <span className="text-white text-sm sm:text-base">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <Badge
                          variant="outline"
                          className={`${
                            task.priority === "high"
                              ? "bg-red-900 text-red-200 border-red-800"
                              : task.priority === "medium"
                                ? "bg-yellow-900 text-yellow-200 border-yellow-800"
                                : "bg-gray-800 text-gray-300 border-gray-700"
                          }`}
                        >
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="capitalize bg-gray-800 text-gray-300 border-gray-700">
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
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h3 className="text-xl font-semibold text-white">Appointments</h3>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white gap-2 w-full sm:w-auto transition-all duration-200"
                onClick={() => setActiveModal("appointment")}
                aria-label="Schedule new meeting"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Schedule Meeting
              </Button>
            </div>
            <div className="space-y-3">
              {dummyData.appointments.map((appointment) => (
                <Card key={appointment.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="space-y-2 flex-1">
                        <h4 className="font-medium text-white">{appointment.title}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-300">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="self-start bg-gray-800 text-gray-300 border-gray-700">
                        {appointment.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "payments":
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h3 className="text-xl font-semibold text-white">Payment Management</h3>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white gap-2 w-full sm:w-auto transition-all duration-200"
                onClick={() => setActiveModal("payment")}
                aria-label="Create new invoice"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Create Invoice
              </Button>
            </div>
            <div className="space-y-3">
              {dummyData.payments.map((payment) => (
                <Card key={payment.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-medium text-white">{payment.invoice}</h4>
                        <p className="text-sm text-gray-300">Due: {payment.dueDate}</p>
                      </div>
                      <div className="flex items-center gap-3 self-start sm:self-center">
                        <span className="text-lg font-semibold text-white">{payment.amount}</span>
                        <Badge
                          variant="outline"
                          className={`${
                            payment.status === "Paid"
                              ? "bg-green-900 text-green-200 border-green-800"
                              : payment.status === "Overdue"
                                ? "bg-red-900 text-red-200 border-red-800"
                                : "bg-yellow-900 text-yellow-200 border-yellow-800"
                          }`}
                        >
                          {payment.status}
                        </Badge>
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
  }, [selectedModule, modules, dummyData])

  const LeftPanel = useCallback(() => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4 text-white">Available Modules</h2>
        <div className="space-y-3">
          {modules.map((module) => {
            const IconComponent = module.icon
            return (
              <div
                key={module.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:shadow-md transition-all duration-200"
                role="group"
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-blue-400" aria-hidden="true" />
                  <span className="text-white">{module.name}</span>
                </div>
                <Switch
                  checked={module.enabled}
                  onCheckedChange={() => toggleModule(module.id)}
                  disabled={module.alwaysEnabled}
                  className="data-[state=checked]:bg-blue-500"
                  aria-label={`Toggle ${module.name} module`}
                />
              </div>
            )
          })}
        </div>
      </div>
      <div className="pt-4 border-t border-gray-700 space-y-4">
        <p className="text-sm text-gray-300">
          <span className="font-medium text-white">{enabledCount}</span> modules selected
        </p>
        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          size="sm"
          aria-label="Reset all modules and data"
        >
          <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
          Reset All
        </Button>
      </div>
    </div>
  ), [modules, enabledCount, toggleModule, handleReset])

  const PreviewPanel = useCallback(() => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Eye className="w-5 h-5 text-blue-400" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-white">Live Preview</h2>
      </div>
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-300">Client Portal Sidebar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {enabledModules.map((module) => {
            const IconComponent = module.icon
            return (
              <button
                key={module.id}
                onClick={() => {
                  setSelectedModule(module.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-all duration-200 ${
                  selectedModule === module.id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-700 text-gray-300 hover:text-white"
                }`}
                aria-label={`View ${module.name} content`}
                aria-current={selectedModule === module.id ? "page" : undefined}
              >
                <IconComponent className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">{module.name}</span>
              </button>
            )
          })}
          {enabledModules.length === 0 && (
            <div className="text-center py-8 text-gray-400" role="alert">
              <FileX className="w-8 h-8 mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm">No modules enabled</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  ), [enabledModules, selectedModule])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-700"
                aria-label="Toggle sidebar"
                aria-expanded={sidebarOpen}
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Portal Builder</h1>
                <p className="text-gray-300 mt-1 text-sm sm:text-base hidden sm:block">
                  Customize your client portal experience
                </p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white gap-2 text-sm sm:text-base"
              aria-label="Save portal configuration"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="w-4 h-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save Portal"}</span>
              <span className="sm:hidden">{isSaving ? "Saving..." : "Save"}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)] relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <div
          className={`
            fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
            w-80 border-r border-gray-700 bg-gray-800/95 lg:bg-gray-800/30 p-4 sm:p-6
            transform transition-transform duration-300 ease-in-out lg:transform-none
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
          aria-hidden={!sidebarOpen}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-md hover:bg-gray-700"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
          <LeftPanel />
        </div>
        <div className="hidden md:block w-80 lg:w-80 border-r border-gray-700 bg-gray-800/20 p-4 lg:p-6">
          <PreviewPanel />
        </div>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="md:hidden mb-6">
            <PreviewPanel />
          </div>
          {renderModuleContent()}
        </main>
      </div>

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

export default PortalBuilderDashboard