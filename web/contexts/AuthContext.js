"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [books, setBooks] = useState([]);
	const router = useRouter();
	const wsRef = useRef(null);

	useEffect(() => {
		const storedAuth = localStorage.getItem("isAuthenticated");
		const storedRole = localStorage.getItem("userRole");

		if (storedAuth === "true" && storedRole) {
			setIsAuthenticated(true);
			setUserRole(storedRole);
			router.push(storedRole === "admin" ? "/admin" : "/search");
		}

		wsRef.current = new WebSocket("ws://localhost:8080");

		wsRef.current.onopen = () => {
			console.log("Connected to WebSocket");
		};

		wsRef.current.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		wsRef.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.action === "authResult") {
				setIsAuthenticated(data.success);
				setUserRole(data.role);
				if (data.success) {
					localStorage.setItem("isAuthenticated", "true");
					localStorage.setItem("userRole", data.role);
					router.push(data.role === "admin" ? "/admin" : "/search");
				}
			} else if (data.action === "books") {
				setBooks(data.books);
			} else if (data.action === "bookAdded") {
				setBooks((prevBooks) => [...prevBooks, data.book]);
			} else if (data.action === "bookDeleted") {
				setBooks((prevBooks) => prevBooks.filter((book) => book.id !== data.bookId));
			}
		};

		wsRef.current.onclose = () => {
			console.log("WebSocket connection closed");
		};

		return () => {
			if (wsRef.current) wsRef.current.close();
		};
	}, [router]);

	const login = useCallback((qrData) => {
		if (wsRef.current?.readyState === WebSocket.OPEN) {
			wsRef.current.send(JSON.stringify({ action: "scanQR", data: qrData }));
		} else {
			console.error("WebSocket is not open");
		}
	}, []);

	const logout = useCallback(() => {
		setIsAuthenticated(false);
		setUserRole(null);
		setBooks([]);
		localStorage.removeItem("isAuthenticated");
		localStorage.removeItem("userRole");
		router.push("/");
	}, [router]);

	const fetchBooks = useCallback(() => {
		if (wsRef.current?.readyState === WebSocket.OPEN) {
			wsRef.current.send(JSON.stringify({ action: "getBooks" }));
		} else {
			console.error("WebSocket is not open");
		}
	}, []);

	const addBook = useCallback((book) => {
		if (wsRef.current?.readyState === WebSocket.OPEN) {
			wsRef.current.send(JSON.stringify({ action: "addBook", book }));
		} else {
			console.error("WebSocket is not open");
		}
	}, []);

	const deleteBook = useCallback((bookId) => {
		if (wsRef.current?.readyState === WebSocket.OPEN) {
			wsRef.current.send(JSON.stringify({ action: "deleteBook", bookId }));
		} else {
			console.error("WebSocket is not open");
		}
	}, []);

	return (
		<AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, books, fetchBooks, addBook, deleteBook }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
