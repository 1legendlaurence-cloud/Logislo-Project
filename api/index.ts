import express from "express";
import { copilotRouter } from "../src/server/copilotRouter.js";

const app = express();
app.use(express.json({ limit: "15mb" }));

// Mount the copilot router under /api
app.use("/api", copilotRouter);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Logislo API", timestamp: new Date().toISOString() });
});

export default app;
