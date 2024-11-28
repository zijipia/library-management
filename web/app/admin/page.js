"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import BookTable from "@/components/BookTable";
import LogoutButton from "@/components/LogoutButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Admin() {
	const router = useRouter();
	const { isAuthenticated, userRole, books, fetchBooks, addBook, deleteBook } = useAuth();
	const [newBook, setNewBook] = useState({ title: "", author: "", isbn: "" });

	useEffect(() => {
		if (!isAuthenticated || userRole !== "admin") {
			router.push("/");
		} else {
			fetchBooks();
		}
	}, [isAuthenticated, userRole, router, fetchBooks]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewBook((prev) => ({ ...prev, [name]: value }));
	};

	const handleAddBook = (e) => {
		e.preventDefault();
		addBook(newBook);
		setNewBook({ title: "", author: "", isbn: "" });
	};

	const handleDeleteBook = (bookId) => {
		deleteBook(bookId);
	};

	return (
		<div className='container mx-auto p-4'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>Admin Dashboard</h1>
				<LogoutButton />
			</div>

			<form
				onSubmit={handleAddBook}
				className='mb-6 p-4 border rounded-md'>
				<h2 className='text-xl font-semibold mb-4'>Add New Book</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<Input
						type='text'
						name='title'
						value={newBook.title}
						onChange={handleInputChange}
						placeholder='Title'
						required
					/>
					<Input
						type='text'
						name='author'
						value={newBook.author}
						onChange={handleInputChange}
						placeholder='Author'
						required
					/>
					<Input
						type='text'
						name='isbn'
						value={newBook.isbn}
						onChange={handleInputChange}
						placeholder='ISBN'
						required
					/>
				</div>
				<Button
					type='submit'
					className='mt-4'>
					Add Book
				</Button>
			</form>

			<BookTable
				books={books}
				onDelete={handleDeleteBook}
				isAdmin={true}
			/>
		</div>
	);
}
