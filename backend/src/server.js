// // 1️⃣ Import dotenv first
// import dotenv from "dotenv";
// dotenv.config();

import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { ENV } from "./lib/env.js"; // now ENV will have DB_URL
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

const app = express();
const __dirname = path.resolve();

// middleware
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// serve frontend in production
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    console.log("👉 DB_URL =", ENV.DB_URL); // optional: test if loaded
    await connectDB();
    app.listen(ENV.PORT, () =>
      console.log("Server is running on port:", ENV.PORT)
    );
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
