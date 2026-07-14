const mongoose = require("mongoose");
const dns=require("dns")
dns.setServers(["8.8.8.8","8.8.4.4"])

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined. Add it to your .env file.");
    }
    const conn = await mongoose.connect("mongodb+srv://navyanunna:2507@cluster0.ozhpq3c.mongodb.net/userprofile");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
