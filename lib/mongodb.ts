import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Extend global type
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Create a global cache on globalThis (not global directly)
const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  const cache = globalWithMongoose.mongooseCache!;

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    const opts = {
      bufferCommands: false,
    };

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is undefined');
    }

    cache.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }

  return cache.conn;
}
export default dbConnect;
