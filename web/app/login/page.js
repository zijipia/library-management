"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Login() {
	const [scanning, setScanning] = useState(false);
	const scannerRef = useRef(null);
	const router = useRouter();
	const { login, isAuthenticated, userRole } = useAuth();

	useEffect(() => {
		if (isAuthenticated) {
			router.push(userRole === "admin" ? "/admin" : "/search");
		}
	}, [isAuthenticated, userRole, router]);

	useEffect(() => {
		return () => {
			if (scannerRef.current) {
				scannerRef.current.clear();
			}
		};
	}, []);

	const startScanner = () => {
		setScanning(true);
		scannerRef.current = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
		scannerRef.current.render(onScanSuccess, onScanError);
	};

	const onScanSuccess = (decodedText) => {
		console.log("QR Code decoded:", decodedText);
		scannerRef.current.clear();
		setScanning(false);
		login(decodedText);
	};

	const onScanError = (error) => {
		console.warn(error);
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<div className='bg-white p-8 rounded-lg shadow-md w-96'>
				<h1 className='text-2xl font-bold mb-4 text-center'>Login</h1>
				<Button
					onClick={startScanner}
					className='w-full'>
					Scan QR Code to Login
				</Button>
				<div
					id='reader'
					className='w-full'></div>
			</div>
		</div>
	);
}
