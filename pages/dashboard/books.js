import { useState, useEffect } from "react";
import axios from "axios";

import { Html5QrcodeScanner } from "html5-qrcode";

function startScanner() {
	const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
	scanner.render(
		(decodedText) => {
			console.log("Mã QR:", decodedText);
			scanner.clear();
		},
		(error) => console.error("Scan error:", error),
	);
}

export default function Books() {
	const [books, setBooks] = useState([]);

	useEffect(() => {
		axios.get("/api/books").then((response) => setBooks(response.data));
	}, []);

	return (
		<div className='p-4'>
			<button onClick={startScanner}>Scan</button>
			<h1 className='text-2xl font-bold'>Quản lý sách</h1>
			<table className='table-auto w-full mt-4 border'>
				<thead>
					<tr>
						<th className='border px-4 py-2'>ID</th>
						<th className='border px-4 py-2'>Tên sách</th>
						<th className='border px-4 py-2'>Tác giả</th>
						<th className='border px-4 py-2'>Số lượng</th>
					</tr>
				</thead>
				<tbody>
					{books.map((book) => (
						<tr key={book._id}>
							<td className='border px-4 py-2'>{book._id}</td>
							<td className='border px-4 py-2'>{book.title}</td>
							<td className='border px-4 py-2'>{book.author}</td>
							<td className='border px-4 py-2'>{book.quantity}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
