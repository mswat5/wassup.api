import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./lib/db";

//Routes Import
import authRoutes from "./routes/auth.route";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.get("/api-health", async (req: Request, res: Response) => {
  res.json({ message: "hello from wassup api" });
});
app.use("/api/v1/auth", authRoutes);

const PORT = 8000;
app.listen(PORT, () => {
  console.log("server running on ", PORT);
  connectDb();
});
