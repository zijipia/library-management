"use client";

import React from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";
import BookTable from "@/components/BookTable";
import ScanButton from "@/components/ScanButton";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

async function startScanner(onSuccess, onError) {
	const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
	scanner.render(
		(decodedText) => {
			console.log("QR Code:", decodedText);
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
	const [books, setBooks] = React.useState([]);
	const [isAuthenticated, setIsAuthenticated] = React.useState(false);
	const wsRef = React.useRef(null);
	const { theme, setTheme } = useTheme();

	React.useEffect(() => {
		wsRef.current = new WebSocket("ws://localhost:8080");

		wsRef.current.onopen = () => {
			console.log("Connected to WebSocket");
		};

		wsRef.current.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		wsRef.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log(data);
			if (data.action === "authResult") {
				setIsAuthenticated(data.success);
				if (data.success) {
					fetchBooks();
				}
			}
		};

		wsRef.current.onclose = () => {
			console.log("WebSocket connection closed");
		};

		return () => {
			if (wsRef.current) wsRef.current.close();
		};
	}, []);

	const fetchBooks = async () => {
		try {
			const response = await axios.get("http://localhost:5000/api/books");
			setBooks(response.data);
		} catch (error) {
			console.error("Failed to fetch books:", error);
		}
	};

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

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<div className='min-h-screen bg-background text-foreground p-6'>
			<div className='max-w-5xl mx-auto shadow-lg bg-card rounded-lg p-6'>
				{/* Header */}
				<header className='mb-6 flex justify-between items-center'>
					<div>
						<h1 className='text-4xl font-extrabold mb-2'>Book Management</h1>
						<p className='text-muted-foreground'>Scan QR code to search or manage book information in the library.</p>
					</div>
					<Button
						onClick={toggleTheme}
						variant='outline'
						size='icon'>
						{theme === "dark" ?
							<Sun className='h-[1.2rem] w-[1.2rem]' />
						:	<Moon className='h-[1.2rem] w-[1.2rem]' />}
					</Button>
				</header>

				{isAuthenticated ?
					<>
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
					</>
				:	<div className='text-center'>
						<p className='mb-4'>Please scan the QR code to log in.</p>
						<div className='flex justify-center mb-6'>
							<ScanButton onClick={handleScanClick} />
						</div>
						{/* QR Reader */}
						<div
							id='reader'
							className='mb-6'></div>
					</div>
				}
			</div>
		</div>
	);
}
