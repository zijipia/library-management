import connectToDatabase from "../../../lib/mongodb";
import Book from "../../../models/Book";

export default async function handler(req, res) {
	await connectToDatabase();

	if (req.method === "GET") {
		const books = await Book.find({});
		res.status(200).json(books);
	} else if (req.method === "POST") {
		const book = await Book.create(req.body);
		res.status(201).json(book);
	} else {
		res.setHeader("Allow", ["GET", "POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
