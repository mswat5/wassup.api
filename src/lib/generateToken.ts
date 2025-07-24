import { Response } from "express";
import jwt, { JwtPayload as BasePayload } from "jsonwebtoken";

export interface JwtPayload extends BasePayload {
  userId: string;
}
export const generateToken = async (userId: string, res: Response) => {
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
