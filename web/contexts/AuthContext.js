"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [books, setBooks] = useState([]);
	const router = useRouter();
	const wsRef = useRef(null);

	useEffect(() => {
		// Khôi phục trạng thái từ localStorage
		const storedAuth = localStorage.getItem("isAuthenticated");
		const storedRole = localStorage.getItem("userRole");

		if (storedAuth === "true" && storedRole) {
			setIsAuthenticated(true);
			setUserRole(storedRole);

			// Điều hướng đến đúng trang dựa trên vai trò
			router.push(storedRole === "admin" ? "/admin" : "/search");
		}

		// Thiết lập WebSocket
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
			}
		};

		wsRef.current.onclose = () => {
			console.log("WebSocket connection closed");
		};

		return () => {
			if (wsRef.current) wsRef.current.close();
		};
	}, [router]);

	const login = (qrData) => {
		if (wsRef.current?.readyState === WebSocket.OPEN) {
			wsRef.current.send(JSON.stringify({ action: "scanQR", data: qrData }));
		} else {
			console.error("WebSocket is not open");
		}
	};

	const logout = () => {
		setIsAuthenticated(false);
		setUserRole(null);
		setBooks([]);
		localStorage.removeItem("isAuthenticated");
		localStorage.removeItem("userRole");
		router.push("/");
	};

	const fetchBooks = useCallback(() => {
		if (wsRef.current?.readyState === WebSocket.OPEN) {
			wsRef.current.send(JSON.stringify({ action: "getBooks" }));
		} else {
			console.error("WebSocket is not open");
		}
	}, []);

	return (
		<AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, books, fetchBooks }}>
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
