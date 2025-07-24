import { Request, Response } from "express";
import { userLoginSchema, userSignupSchema } from "../lib/zod";
import { formatZodError } from "../lib/formatZodError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  const validation = userSignupSchema.safeParse(req.body);
  if (!validation.success) {
    res
      .status(400)
      .json({ message: { errors: formatZodError(validation.error) } });
    return;
  }
  const { email, password, fullName, username } = validation.data;
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      res.status(400).json({ message: "user already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, fullName, username, password: hashedPassword },
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET_KEY as string,
      {
        // expiresIn: "7d",
      }
    );

    res
      .status(201)
      .cookie("authToken", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        message: "User created successfully",
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          username: newUser.username,
        },
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "something went wrong" });
  }
};

export const login = async (req: Request, res: Response) => {
  const validation = userLoginSchema.safeParse(req.body);
  if (!validation.success) {
    res
      .status(400)
      .json({ message: { errors: formatZodError(validation.error) } });
    return;
  }
  const { email, password } = validation.data;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      return res.status(400).json({ message: "user do not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "invalid credentials" });
      return;
    }
    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET_KEY as string,
      {
        // expiresIn: "7d",
      }
    );

    res
      .status(200)
      .cookie("authToken", token, { httpOnly: true })
      .json({
        message: "Sign in successful",
        token,
        user: {
          id: existingUser.id,
          username: existingUser.username,
          email: existingUser.email,
        },
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "something went wrong" });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.cookie("authToken", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

// export const updateProfile = async (req: Request, res: Response) => {
//   try {
//     const { profilePic } = req.body;
//     const userId = (req as any).user?._id;
//     if (!profilePic) {
//       return res.status(400).json({ message: "pic not provided" });
//     }
//     const uploadRes = await cloudinary.uploader.upload(profilePic);
//     const updatedUser = await prisma.user.update(
//       userId,

//     );
//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ message: "something went wrong" });
//   }
// };

export const checkAuth = (req: Request, res: Response) => {
  try {
    res.status(200).json((req as any).user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};
