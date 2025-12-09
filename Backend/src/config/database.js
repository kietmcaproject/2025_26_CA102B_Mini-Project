import mongoose from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const options = {
      minPoolSize: 5,
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    await mongoose.connect(process.env.MONGODB_URL, options);

    console.log(chalk.green.bold("✅ Connected to MongoDB Successfully"));
    console.log(
      chalk.cyan(`🌐 Connection Pool: min=5 | max=${options.maxPoolSize}`)
    );
  } catch (error) {
    console.error(chalk.red.bold("❌ MongoDB Connection Failed"));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};

export default connectDB;
