import { Request, Response } from "express";
import { userLoginSchema, userSignupSchema } from "../lib/zod";
import { formatZodError } from "../lib/formatZodError";
import User, { UserType } from "../models/user";

import bcrypt from "bcryptjs";
import { generateToken } from "../lib/generateToken";
import cloudinary from "../lib/cloudinary";

export interface AuthenticatedRequest extends Request {
  user?: UserType;
}

export const signup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validation = userSignupSchema.safeParse(req.body);
    if (!validation.success) {
      res
        .status(400)
        .json({ message: { errors: formatZodError(validation.error) } });
      return;
    }
    const { email, password, fullName } = validation.data;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "user already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "invalid user data" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "something went wrong" });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validation = userLoginSchema.safeParse(req.body);
    if (!validation.success) {
      res
        .status(400)
        .json({ message: { errors: formatZodError(validation.error) } });
      return;
    }
    const { email, password } = validation.data;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.status(400).json({ message: "user do not exist" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "invalid credentials" });
      return;
    }
    generateToken(existingUser._id, res);
    res.status(200).json({
      _id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      profilePic: existingUser.profilePic,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "something went wrong" });
  }
};

export const logout = (req: AuthenticatedRequest, res: Response) => {
  try {
    res.cookie("auth-token", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user?._id;
    if (!profilePic) {
      return res.status(400).json({ message: "pic not provided" });
    }
    const uploadRes = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadRes.secure_url,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "something went wrong" });
  }
};

export const checkAuth = (req: AuthenticatedRequest, res: Response) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};
