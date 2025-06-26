import mongoose from "mongoose"

export const PortalSchema = new mongoose.Schema({
    clietName: String,
    clientEmail: String,
    projectDescription: String
})