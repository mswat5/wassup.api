import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from "../models/user";
import { AuthenticatedRequest } from "../controllers/auth.controller";
import { JwtPayload } from "../lib/generateToken";
config();
export const protectRoute = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(400).json({ message: "unauthorized-no token" });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;
    if (!decoded) {
      return res.status(400).json({ message: "unauthorized-invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in protected route", error);
    res.status(500).json({ message: "internal server error" });
  }
};
