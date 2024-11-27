"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import BookTable from "@/components/BookTable";
import LogoutButton from "@/components/LogoutButton";

export default function Admin() {
	const router = useRouter();
	const { isAuthenticated, userRole, books, fetchBooks } = useAuth();

	useEffect(() => {
		if (!isAuthenticated || userRole !== "admin") {
			router.push("/");
		} else {
			fetchBooks();
		}
	}, [isAuthenticated, userRole, router, fetchBooks]);

	return (
		<div className='container mx-auto p-4'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>Admin Dashboard</h1>
				<LogoutButton />
			</div>
			<BookTable books={books} />
		</div>
	);
}
