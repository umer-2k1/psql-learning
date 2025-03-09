import mongoose, { Connection } from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: "./src/config/config.env",
});

const connectDB = async (): Promise<void> => {
  try {
    const { connection }: { connection: Connection } = await mongoose.connect(
      process.env.MONGO_URI as string
    );
    console.log("DB connected: " + connection.host);
  } catch (error) {
    console.log("Error connecting database: " + error);
    process.exit(1);
  }
};

export default connectDB;
