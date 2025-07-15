import { mongoose } from "@repo/db/mongoose";
import { Schema } from "mongoose";
import { OverviewModule, TaskModule, LeadModule, PaymentModule, AppointmentModule, Portal } from './interfaces';

// Overview Module Schema
export const OverviewModuleSchema = new Schema<OverviewModule>({
    title: String,
    summary: String,
});

// Task Schema
export const TaskSchema = new Schema({
    id: String,
    title: String,
    description: String,
    status: String, 
    priority: String, 
    dueDate: String,
});

export const TaskModuleSchema = new Schema<TaskModule>({
    tasks: [TaskSchema],
});

// Lead Schema
export const LeadSchema = new Schema({
    id: String,
    name: String,
    email: String,
    phone: String,
    status: String,
    value: Number,
    source: String,
});

export const LeadModuleSchema = new Schema<LeadModule>({
    leads: [LeadSchema],
});

// Payment Schema
export const PaymentSchema = new Schema({
    id: String,
    client: String,
    amount: Number,
    status: String, 
    dueDate: String,
    invoiceNumber: String,
});

export const PaymentModuleSchema = new Schema<PaymentModule>({
    payments: [PaymentSchema],
});

// Appointment Schema
export const AppointmentSchema = new Schema({
    id: String,
    title: String,
    client: String,
    date: String,
    time: String,
    status: String, 
    meetingUrl: String,
});

export const AppointmentModuleSchema = new Schema<AppointmentModule>({
    appointments: [AppointmentSchema],
});

// Portal Schema
export const PortalSchema = new Schema<Portal>({
    portalName: String,
    clientName: String,
    clientEmail: String,
    projectDescription: String,
    progress: Number,
    userId: String,
    inbox: { type: Number, default: 0 },
    status: { type: String, default: "Inactive" },
    createdAt: { type: Date, default: Date.now },
    lastVisited: { type: Date, default: null },
    feedback: { type: Boolean, default: false },
    modules: {
        type: {
            overview: { type: OverviewModuleSchema, required: false },
            tasks: { type: TaskModuleSchema, required: false },
            leads: { type: LeadModuleSchema, required: false },
            payments: { type: PaymentModuleSchema, required: false },
            appointments: { type: AppointmentModuleSchema, required: false },
        },
        required: false,
    },
});

export const PortalModel = mongoose.models.Portal || mongoose.model("Portal", PortalSchema);