require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Thoát nếu không kết nối được
  }
})();

// load routes
(async () => {
  const routesDir = path.join(__dirname, "routes");
  try {
    const files = await fs.readdir(routesDir);
    await Promise.all(
      files
        .filter((file) => file.endsWith(".js"))
        .map(async (file) => {
          const routePath = `./routes/${file}`;
          const route = require(routePath);
          const routeName = file.replace(".js", "");
          app.use(`/api/${routeName}`, route);
          console.log(`🔗 Route loaded: /api/${routeName}`);
        })
    );
  } catch (err) {
    console.error("❌ Error loading routes:", err);
  }
})();

// services
(async () => {
  const servicesDir = path.join(__dirname, "services");
  try {
    const files = await fs.readdir(servicesDir);
    await Promise.all(
      files
        .filter((file) => file.endsWith(".js"))
        .map(async (file) => {
          const servicePath = `./services/${file}`;
          require(servicePath);
          console.log(`🔧 Service loaded: ${file}`);
        })
    );
  } catch (err) {
    console.error("❌ Error loading services:", err);
  }
})();

// Load MQTT server
require("./server/mqttserver");

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

console.log("✨ All systems initialized");
