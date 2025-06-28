import { mongoose } from "@repo/db/mongoose"
import { OverviewModule, TaskModule, LeadModule, Portal } from './interfaces'

const Schema = mongoose.Schema

export const OverviewModuleSchema = new Schema<OverviewModule>({
    title: String,
    summary: String,
});


export const TaskSchema = new Schema({
    title: String,
    completed: Boolean,
});

export const TaskModuleSchema = new Schema<TaskModule>({
    tasks: [TaskSchema],
});


export const LeadSchema = new Schema({
    name: String,
    email: String,
});

export const LeadModuleSchema = new Schema<LeadModule>({
    leads: [LeadSchema],
});

export const PortalSchema = new Schema<Portal>({
    clientName: String,
    clientEmail: String,
    projectDescription: String,
    progress: Number,
    userId: String,
    inbox: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    lastVisited: { type: Date, default: null },
    modules: {
        type: {
            overview: { type: OverviewModuleSchema, required: false },
            tasks: { type: TaskModuleSchema, required: false },
            leads: { type: LeadModuleSchema, required: false },
        }, required: false
    },
});

export const PortalModel = mongoose.models.Portal || mongoose.model("Portal", PortalSchema);