const mongoose = require('mongoose');
const { MONGODB_CONFIG } = require('./config.js');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      ...MONGODB_CONFIG.OPTIONS
    };

    cached.promise = mongoose.connect(MONGODB_CONFIG.URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (cached.conn) {
    await cached.conn.disconnect();
    console.log('MongoDB disconnected through app termination');
    process.exit(0);
  }
});

module.exports = dbConnect;
