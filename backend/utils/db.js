import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Checking if we are already connected
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Stop the server if DB fails
  }
};

export default connectDB;
