import { Request, Response } from "express";
import { userLoginSchema, userSignupSchema } from "../lib/zod";
import { formatZodError } from "../lib/formatZodError";
import User from "../models/user";

import bcrypt from "bcryptjs";
import { generateToken } from "../lib/generateToken";

export const signup = async (req: Request, res: Response) => {
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
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ message: "invalid user data" });
    }

    await newUser.save();

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "something went wrong" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validation = userLoginSchema.safeParse(req.body);
    if (!validation.success) {
      res
        .status(400)
        .json({ message: { errors: formatZodError(validation.error) } });
      return;
    }
    const { email } = validation.data;
    const existingUser = User.findOne({ email });
    if (!existingUser) {
      res.status(400).json({ message: "user already exists" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "something went wrong" });
  }
};
