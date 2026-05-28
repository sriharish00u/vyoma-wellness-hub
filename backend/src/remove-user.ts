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
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function removeUser() {
  console.log("\n🗑️  Vyoma — Remove User\n");

  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB\n");

  const email = await prompt("User email to remove: ");

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("❌ Invalid email address.");
    process.exit(1);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.error(`❌ No user found with email "${email}".`);
    process.exit(1);
  }

  console.log(`\n   Name  : ${user.name}`);
  console.log(`   Email : ${user.email}`);
  console.log(`   Role  : ${user.role}`);

  const confirm = await prompt(`\nDelete ${user.name}? (y/N): `);
  if (confirm !== "y" && confirm !== "yes") {
    console.log("✋ Cancelled.");
    await mongoose.disconnect();
    process.exit(0);
  }

  await User.findByIdAndDelete(user._id);
  console.log(`\n✅ User "${user.name}" (${user.email}) deleted.`);

  await mongoose.disconnect();
  process.exit(0);
}

removeUser().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
