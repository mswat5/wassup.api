import { z } from "zod";

export const userSignupSchema = z.object({
  email: z.email(),
  fullName: z.string().min(3, "Name must be at least 3 characters long"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const checkUsernameSchema = z.object({
  username: z.string().nonempty("Username is required"),
});
