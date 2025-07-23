import mongoose from "mongoose";

export const connectDb = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI as string);
  console.log(`mongo connected ${conn.connection.host}`);
};
