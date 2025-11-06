const mongoose = require("mongoose");

const connectDB = async () => {

  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log("Error al conectarse al  base de dato", error);
    process.exit(1);
  }
  
};

module.exports = connectDB;
