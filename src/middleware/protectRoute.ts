import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { PrismaClient } from "../../generated/prisma";
config();

const prisma = new PrismaClient();
export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(400).json({ message: "unauthorized-no token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    if (!decoded) {
      return res.status(400).json({ message: "unauthorized-invalid token" });
    }
    (req as any).user = decoded;

    next();
  } catch (error) {
    console.log("error in protected route", error);
    res.status(500).json({ message: "internal server error" });
  }
};
