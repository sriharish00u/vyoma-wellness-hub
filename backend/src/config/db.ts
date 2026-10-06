import mongoose from "mongoose";

export async function connectDB() {
  const uri =
    process.env.MONGO_URI ??
    "mongodb+srv://techlearnersoffl_db_user:CvSFLkjsppObfPBi@cluster0.wic7p6p.mongodb.net/vyoma?retryWrites=true&w=majority&appName=Cluster0";
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    // Schedule retry without exiting process
    setTimeout(connectDB, 5000);
  }
}
