import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 1500
    });
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.warn('MongoDB unavailable; switching to local in-memory fallback:', error.message);
    return false;
  }
};
