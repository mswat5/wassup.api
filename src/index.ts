import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./lib/db";

const app = express();
app.use(express.json());
app.use(cors());
app.get("/api-health", async (req: Request, res: Response) => {
  res.json({ message: "hello from food api" });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log("server running on ", PORT);
  connectDb();
});
