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

  const name = await prompt("Admin name: ");
  const email = await prompt("Admin email: ");
  const password = await prompt("Admin password (min 8 chars): ", true);

  if (!name || name.length < 2) {
    console.error("❌ Name must be at least 2 characters.");
    process.exit(1);
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("❌ Invalid email address.");
    process.exit(1);
  }
  if (!password || password.length < 8) {
    console.error("❌ Password must be at least 8 characters.");
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

  const hashed = await bcrypt.hash(password, 12);
  const admin = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashed,
    role: "admin",
    plan: "annual",
  });

  console.log(`\n✅ Admin created successfully!`);
  console.log(`   Name  : ${admin.name}`);
  console.log(`   Email : ${admin.email}`);
  console.log(`   Role  : admin`);
  console.log(`\n→ Login at /admin/login using these credentials.\n`);

  await mongoose.disconnect();
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("❌ Failed to create admin:", err.message);
  process.exit(1);
});
