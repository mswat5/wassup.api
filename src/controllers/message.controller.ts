import { Request, Response } from "express";

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const {} = req.body;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};
