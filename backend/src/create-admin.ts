import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as readline from "readline";
import { User } from "./models/User.js";

const uri = process.env.MONGO_URI ?? "mongodb://localhost:27017/vyoma";

function prompt(question: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    if (hidden) {
      process.stdout.write(question);
      let input = "";
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", function handler(char: string) {
        if (char === "\r" || char === "\n") {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.removeListener("data", handler);
          process.stdout.write("\n");
          rl.close();
          resolve(input);
        } else if (char === "\u0003") {
          process.exit();
        } else if (char === "\u007f") {
          if (input.length > 0) {
            input = input.slice(0, -1);
            process.stdout.write("\b \b");
          }
        } else {
          input += char;
          process.stdout.write("*");
        }
      });
    } else {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    }
  });
}

async function createAdmin() {
  console.log("\n🔐 Vyoma Admin — One-Time Setup\n");

  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB\n");

  const email = await prompt("Admin Gmail: ");

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("❌ Invalid email address.");
    process.exit(1);
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    if (existing.role === "admin") {
      console.error(`❌ An admin with email "${email}" already exists.`);
    } else {
      console.error(`❌ A regular user with email "${email}" already exists. Use a different email for the admin.`);
    }
    process.exit(1);
  }

  const hashed = await bcrypt.hash("1234", 12);
  const admin = await User.create({
    name: "",
    email: email.toLowerCase(),
    password: hashed,
    role: "admin",
    plan: "annual",
    needsSetup: true,
  });

  console.log(`\n✅ Admin created successfully!`);
  console.log(`   Email : ${admin.email}`);
  console.log(`   Role  : admin`);
  console.log(`   Password : 1234 (change on first login)`);
  console.log(`\n→ Login at /login using these credentials.\n`);

  await mongoose.disconnect();
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("❌ Failed to create admin:", err.message);
  process.exit(1);
});
