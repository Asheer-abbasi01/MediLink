import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📘 Using Database: ${conn.connection.name}`);

    // Optional: list all collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("📦 Collections found:", collections.map(c => c.name));
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
