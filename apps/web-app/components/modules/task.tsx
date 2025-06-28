"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@repo/ui/button"
import Input from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Textarea } from "@repo/ui/text-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: any) => void
}

export function TaskModal({ isOpen, onClose, onSubmit }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    priority: "medium",
    status: "todo",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = "Task title is required"
    if (!formData.deadline) newErrors.deadline = "Deadline is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
      setFormData({ title: "", description: "", assignedTo: "", deadline: "", priority: "medium", status: "todo" })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-black border border-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-300">
              Task Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="Enter task title"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="Task description..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="assignedTo" className="text-gray-300">
              Assigned To
            </Label>
            <Input
              id="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="Team member name"
            />
          </div>

          <div>
            <Label htmlFor="deadline" className="text-gray-300">
              Deadline *
            </Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
            />
            {errors.deadline && <p className="text-red-400 text-sm mt-1">{errors.deadline}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-300">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
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
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
