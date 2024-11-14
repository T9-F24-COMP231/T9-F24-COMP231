const config = { 
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
    mongoUri:
      process.env.MONGODB_URI ||
      "mongodb://0.0.0.0:27017/clearProperty" ||
      process.env.MONGO_HOST ||
      "mongodb://" +
        (process.env.IP || "localhost") + 
        ":" +
        (process.env.MONGO_PORT || "27017") +
        "/clearProperty",
  };
  export default config;
  