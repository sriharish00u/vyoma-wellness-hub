import "dotenv/config";
import mongoose from "mongoose";
import * as readline from "readline";
import { User } from "./models/User.js";

const uri = process.env.MONGO_URI ?? "mongodb://localhost:27017/vyoma";

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function makeAdmin() {
  console.log("\n🔐 Vyoma — Make Admin\n");

  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB\n");

  const email = await prompt("User email to promote to admin: ");

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("❌ Invalid email address.");
    process.exit(1);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.error(`❌ No user found with email "${email}".`);
    process.exit(1);
  }

  if (user.role === "admin") {
    console.error(`❌ User "${email}" is already an admin.`);
    process.exit(1);
  }

  user.role = "admin";
  await user.save();

  console.log(`\n✅ ${user.name} is now an admin!`);
  console.log(`   Email : ${user.email}`);
  console.log(`   Role  : admin`);
  console.log(`\n→ They can access /admin in the dashboard.\n`);

  await mongoose.disconnect();
  process.exit(0);
}

makeAdmin().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
