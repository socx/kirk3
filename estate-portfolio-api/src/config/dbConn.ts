import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI as string);
  } catch (err) {
    console.error(err);
  }
};
