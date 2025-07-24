import { email, z } from "zod";

export const userSignupSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  fullName: z.string(),
  profilePic: z.string().nullable(),
});

export const userLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const updateProfileSchema = z.object({
  email: z.email(),
  fullName: z.string(),
});
