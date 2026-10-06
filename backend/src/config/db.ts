import mongoose from "mongoose";

export async function connectDB() {
  const defaultUri =
    "mongodb+srv://techlearnersoffl_db_user:CvSFLkjsppObfPBi@cluster0.wic7p6p.mongodb.net/vyoma?retryWrites=true&w=majority&appName=Cluster0";
  let uri = process.env.MONGO_URI || defaultUri;

  // Handle unresolvable cluster hostname from old Render env variables
  if (uri.includes("qm3l3bg.mongodb.net")) {
    uri = defaultUri;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connected successfully to", uri.replace(/:[^:@]+@/, ":****@"));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    setTimeout(connectDB, 5000);
  }
}
