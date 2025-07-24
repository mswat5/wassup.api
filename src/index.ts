import express, { Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
//Routes Import
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
//TODO:can msg urself, markdown wali chiz whatsapp ki trh, username search krke hi baat krega ,and jisse baat start hogi uska ayega sidebar me

//firto syd jb jis user ka name search kre usi ka details fetch kre
//baki sidebar me only with them jisse chat start hogyi

//sbse xote lvl ke changes se start krna, jese pura flow na change ho start me aise changes krna,(add-ons types)
//how we check about the number of users visited our website
//by signup ..signup flow easy rkhna..jisse user direct aye and register krke turant app chla ske
app.get("/api-health", async (res: Response) => {
  res.json({ message: "hello from wassup api" });
});
app.use("/api/v1/auth", authRoutes);
app.use("api/v1/message", messageRoutes);

const PORT = 8000;
app.listen(PORT, () => {
  console.log("server running on ", PORT);
});
