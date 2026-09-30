import mongoose from 'mongoose';
import dns from 'dns';

// Configure reliable DNS servers to resolve MongoDB Atlas SRV records on Windows/Node.js
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('[DNS Warning] Could not set custom DNS servers:', e.message);
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return true;
  }

  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense_tracker';

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoURI, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((m) => {
        console.log(`[MongoDB Atlas] Successfully Connected! Host: ${m.connection.host}, Database: ${m.connection.name}`);
        return m;
      })
      .catch((error) => {
        console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${mongoURI}: ${error.message}`);
        console.warn(`[MongoDB Info] Application will run with local in-memory fallback cache.`);
        cached.promise = null;
        return null;
      });
  }

  try {
    const res = await cached.promise;
    cached.conn = res;
    return !!res && mongoose.connection.readyState === 1;
  } catch {
    cached.promise = null;
    return false;
  }
};
