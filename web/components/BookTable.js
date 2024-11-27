import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function BookTable({ books }) {
	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[100px]'>ID</TableHead>
						<TableHead>Title</TableHead>
						<TableHead>Author</TableHead>
						<TableHead className='text-right'>ISBN</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{books.map((book) => (
						<TableRow key={book.id}>
							<TableCell className='font-medium'>{book.id}</TableCell>
							<TableCell>{book.title}</TableCell>
							<TableCell>{book.author}</TableCell>
							<TableCell className='text-right'>{book.isbn}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
