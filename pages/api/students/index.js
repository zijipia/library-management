import connectToDatabase from "../../../lib/mongodb";
import Student from "../../../models/Student";

export default async function handler(req, res) {
	await connectToDatabase();

	if (req.method === "GET") {
		const students = await Student.find({});
		res.status(200).json(students);
	} else if (req.method === "POST") {
		const student = await Student.create(req.body);
		res.status(201).json(student);
	} else {
		res.setHeader("Allow", ["GET", "POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
