import mongoose from "mongoose";

// const uri = "mongodb+srv://rubidya-demo:rubdemo-5959@cluster0.cnra4yh.mongodb.net/?retryWrites=true&w=majority";

// const uri = "mongodb+srv://rubi-db:rubidya5959@cluster0.t0a7mhd.mongodb.net/?retryWrites=true&w=majority" // OG

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://rubi-db:rubidya5959@cluster0.t0a7mhd.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
