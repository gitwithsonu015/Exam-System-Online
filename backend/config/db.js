const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Some connection strings may contain extra URL segments like: ?online-exam-system=...
    // If that causes Mongo error, remove/ignore unknown query params.
    let mongoUri = (process.env.MONGODB_URI || process.env.MONGO_URI);

    // Your Mongo URI may contain extra query params like:
    //   ?online-exam-system=Cluster0
    // Mongoose/MongoDB driver can throw: "option online-exam-system is not supported"
    // Remove everything starting from "?" if it includes unknown params.
    if (typeof mongoUri === 'string' && mongoUri.includes('?')) {
      const base = mongoUri.split('?')[0];
      // Keep only if it already has required params; otherwise drop query.
      // For this project, base URI works fine.
      mongoUri = base;
    }

    const conn = await mongoose.connect(mongoUri);


    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
