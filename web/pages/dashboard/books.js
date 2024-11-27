import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";
import BookTable from "@/components/BookTable";
import ScanButton from "@/components/ScanButton";

async function startScanner(onSuccess, onError) {
	const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
	scanner.render(
		(decodedText) => {
			console.log("Mã QR:", decodedText);
			onSuccess(decodedText);
			scanner.clear();
		},
		(error) => {
			console.error("Scan error:", error);
			if (onError) onError(error);
		},
	);
}

export default function Books() {
	const [books, setBooks] = useState([]);
	const wsRef = useRef(null);

	useEffect(() => {
		wsRef.current = new WebSocket("ws://localhost:8080");

		wsRef.current.onopen = () => {
			console.log("Connected to WebSocket");
		};

		wsRef.current.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		wsRef.current.onclose = () => {
			console.log("WebSocket connection closed");
		};

		return () => {
			if (wsRef.current) wsRef.current.close();
		};
	}, []);

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const response = await axios.get("http://localhost:5000/api/books");
				setBooks(response.data);
			} catch (error) {
				console.error("Failed to fetch books:", error);
			}
		};

		fetchBooks();
	}, []);

	const handleScanClick = () => {
		startScanner(
			(data) => {
				if (wsRef.current?.readyState === WebSocket.OPEN) {
					wsRef.current.send(JSON.stringify({ action: "scanQR", data }));
				} else {
					console.error("WebSocket is not open");
				}
			},
			(error) => {
				console.error("Scanner error:", error);
			},
		);
	};

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 p-6'>
			<div className='max-w-5xl mx-auto shadow-lg bg-white dark:bg-gray-800 rounded-lg p-6'>
				{/* Header */}
				<header className='mb-6'>
					<h1 className='text-4xl font-extrabold text-center mb-2'>Quản Lý Sách</h1>
					<p className='text-center text-gray-600 dark:text-gray-400'>
						Quét mã QR để tìm kiếm hoặc quản lý thông tin sách trong thư viện.
					</p>
				</header>

				{/* Scan Button */}
				<div className='flex justify-center mb-6'>
					<ScanButton onClick={handleScanClick} />
				</div>

				{/* QR Reader */}
				<div
					id='reader'
					className='mb-6'></div>

				{/* Book Table */}
				<BookTable books={books} />
			</div>
		</div>
	);
}
