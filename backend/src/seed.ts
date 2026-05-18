import "dotenv/config";
import mongoose from "mongoose";
import { Program } from "./models/Program";

const programs = [
  { slug: "morning-yoga", title: "Morning Yoga Flow", level: "Beginner", duration: "20 min", icon: "Sunrise", tag: "Yoga", desc: "Gentle vinyasa to wake the body and steady the mind.", order: 1 },
  { slug: "strength-foundations", title: "Strength Foundations", level: "Intermediate", duration: "35 min", icon: "Dumbbell", tag: "Fitness", desc: "Progressive bodyweight + dumbbell strength sessions.", order: 2 },
  { slug: "pranayama-basics", title: "Pranayama Basics", level: "All levels", duration: "15 min", icon: "Wind", tag: "Breathwork", desc: "Structured breath practice for calm focus.", order: 3 },
  { slug: "calm-mind", title: "Calm Mind Meditation", level: "All levels", duration: "12 min", icon: "Brain", tag: "Meditation", desc: "Guided sessions to reduce stress and reset focus.", order: 4 },
  { slug: "core-cardio", title: "Core & Cardio", level: "Intermediate", duration: "25 min", icon: "HeartPulse", tag: "Fitness", desc: "Low-impact cardio with core stability work.", order: 5 },
  { slug: "daily-discipline", title: "Daily Discipline", level: "All levels", duration: "10 min", icon: "Sparkles", tag: "Motivation", desc: "A daily micro-habit framework that compounds.", order: 6 },
];

const uri = process.env.MONGO_URI ?? "mongodb://localhost:27017/vyoma";

async function seed() {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
  await Program.deleteMany({});
  await Program.insertMany(programs);
  console.log("Seeded 6 programs");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
