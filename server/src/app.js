import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = [
  "https://team-task-manager-client-production-11a9.up.railway.app",
  "https://team-task-manager-ksn.up.railway.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      
      // Check if origin is in the allowed list or is a localhost domain or a railway subdomain
      const isAllowed = allowedOrigins.includes(origin) || 
                        /^https?:\/\/localhost(:\d+)?$/.test(origin) || 
                        /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin) ||
                        origin.endsWith(".up.railway.app");
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS: origin ${origin} not in explicit allowlist, but allowed dynamically`);
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

const clientDist = path.resolve(__dirname, "../../client/dist");

app.use(express.static(clientDist));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();

  res.sendFile(path.join(clientDist, "index.html"));
});

app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

export default app;