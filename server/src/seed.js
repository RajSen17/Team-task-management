import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./config/db.js";
import Project from "./models/Project.js";
import Task from "./models/Task.js";
import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function seed() {
  await connectDb();
  await Promise.all([Task.deleteMany(), Project.deleteMany(), User.deleteMany()]);

  const [admin, member] = await User.create([
    {
      name: "Aarav Admin",
      email: "admin@example.com",
      password: "Password123!",
      role: "Admin"
    },
    {
      name: "Maya Member",
      email: "member@example.com",
      password: "Password123!",
      role: "Member"
    }
  ]);

  const project = await Project.create({
    name: "Website Redesign",
    description: "Launch a refreshed product website with clear ownership and status tracking.",
    owner: admin._id,
    members: [admin._id, member._id]
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await Task.create([
    {
      title: "Create dashboard wireframe",
      description: "Draft the main dashboard and task summary layout.",
      project: project._id,
      assignee: member._id,
      createdBy: admin._id,
      dueDate: tomorrow,
      priority: "High",
      status: "In Progress"
    },
    {
      title: "Review project copy",
      description: "Check page copy for clarity before handoff.",
      project: project._id,
      assignee: admin._id,
      createdBy: admin._id,
      dueDate: yesterday,
      priority: "Medium",
      status: "Todo"
    }
  ]);

  console.log("Seed data created");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
