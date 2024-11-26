import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
	name: String,
	studentId: String,
	borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
