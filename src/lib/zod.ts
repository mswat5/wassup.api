import { z } from "zod";

export const userSignupSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  fullName: z.string(),
});

export const userLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
