const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

module.exports = mongoose.model("Student", StudentSchema);
