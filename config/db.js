const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  const mongoUri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eco_sync";
  try {
    await mongoose.connect(mongoUri);
    return { uri: mongoUri, memory: false };
  } catch (error) {
    const memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri();
    await mongoose.connect(memoryUri);
    return { uri: memoryUri, memory: true };
  }
};

module.exports = connectDB;
