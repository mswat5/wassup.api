import mongoose from "mongoose";

export type UserType = {
  _id: string;
  email: string;
  fullName: string;
  password: string;
  profilePic: string;
};

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model<UserType>("User", userSchema);

export default User;
