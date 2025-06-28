import mongoose from "mongoose";
console.log(process.env.MONGODB_URI)

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://admin:admin123@relient-dev-cluster.oabwtaz.mongodb.net/test";

async function connectDb() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
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
