import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
	title: String,
	author: String,
	genre: String,
	quantity: Number,
	status: { type: String, default: "available" },
});

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
