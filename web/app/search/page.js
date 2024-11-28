"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BookTable from "@/components/BookTable";
import LogoutButton from "@/components/LogoutButton";

export default function Search() {
	const router = useRouter();
	const { isAuthenticated, books, fetchBooks } = useAuth();
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/");
		} else {
			fetchBooks();
		}
	}, [isAuthenticated, router, fetchBooks]);

	const handleSearch = (e) => {
		e.preventDefault();
		const results = books.filter(
			(book) =>
				book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				book.author.toLowerCase().includes(searchTerm.toLowerCase()),
		);
		setSearchResults(results);
	};

	return (
		<div className='container mx-auto p-4'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>Search Books</h1>
				<LogoutButton />
			</div>
			<form
				onSubmit={handleSearch}
				className='mb-4'>
				<div className='flex gap-2'>
					<Input
						type='text'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder='Search by title or author'
						className='flex-grow'
					/>
					<Button type='submit'>Search</Button>
				</div>
			</form>
			<BookTable
				books={searchResults.length > 0 ? searchResults : books}
				isAdmin={false}
			/>
		</div>
	);
}
