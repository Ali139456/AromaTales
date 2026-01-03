import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  // If already connected, return
  if (isConnected) {
    console.log('MongoDB: Using existing connection');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aroma-tales');
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't exit process - allow app to continue (fallback data will be used)
    // In production, this allows the frontend to still work with fallback data
    isConnected = false;
  }
};

export default connectDB;
