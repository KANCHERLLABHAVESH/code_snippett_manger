import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is missing. Add it to your environment.");
  }

  await mongoose.connect(uri, {
    dbName: "code_snippet_manager",
  });

  console.log("MongoDB connected");
};

export default connectDB;

