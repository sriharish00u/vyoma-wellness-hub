import mongoose from "mongoose";

export async function connectDB() {
  const uri =
    process.env.MONGO_URI ??
    "mongodb+srv://arishexim011_db_user:SqIhDdrubZjTMa8j@cluster0.qm3l3bg.mongodb.net/vyoma?appName=Cluster0";
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
