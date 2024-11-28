import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function BookTable({ books, onDelete, isAdmin }) {
	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[100px]'>ID</TableHead>
						<TableHead>Title</TableHead>
						<TableHead>Author</TableHead>
						<TableHead className='text-right'>ISBN</TableHead>
						{isAdmin && <TableHead className='w-[100px]'>Actions</TableHead>}
					</TableRow>
				</TableHeader>
				<TableBody>
					{books.map((book) => (
						<TableRow key={book._id}>
							<TableCell className='font-medium'>{book._id}</TableCell>
							<TableCell>{book.title}</TableCell>
							<TableCell>{book.author}</TableCell>
							<TableCell className='text-right'>{book.isbn}</TableCell>
							{isAdmin && (
								<TableCell>
									<Button
										variant='destructive'
										size='sm'
										onClick={() => onDelete(book._id)}>
										<Trash2 className='h-4 w-4' />
									</Button>
								</TableCell>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
