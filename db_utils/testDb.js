import dbConnect from './db.js';

async function testConnection() {
  try {
    await dbConnect();
    console.log('✅ MongoDB connection test successful');
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
  }
}

testConnection(); 