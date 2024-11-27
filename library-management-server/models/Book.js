const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  quantity: Number,
  status: { type: String, default: "available" },
});

module.exports = mongoose.model("Book", BookSchema);
