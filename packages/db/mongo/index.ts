
import dotenv from "dotenv"
import mongoose from "mongoose";

dotenv.config()

const url = process.env.MONGODB_URI as string

async function connectDb() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(url);
      console.log("MongoDB connected");
    } else {
      console.log("MongoDB already connected");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error; 
  }
}

export { connectDb, mongoose }
