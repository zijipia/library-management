const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Kết nối MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/students", require("./routes/students"));

// Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// mqtt
require("./services/mqtt");

// websocket
require("./services/websocket");

console.log("Started sever");
