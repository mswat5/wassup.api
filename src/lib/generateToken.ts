import { Response } from "express";
import jwt from "jsonwebtoken";
export const generateToken = async (userId: any, res: Response) => {
  const token = jwt.sign(
    { userId: userId },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "7d",
    }
  );
  res.cookie("auth-token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return token;
};
