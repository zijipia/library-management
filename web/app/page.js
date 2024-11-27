"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
	const router = useRouter();
	const { isAuthenticated, userRole } = useAuth();
	console.log(userRole);
	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/login");
		} else if (userRole === "admin") {
			router.push("/admin");
		} else {
			router.push("/search");
		}
	}, [isAuthenticated, userRole, router]);

	return <div>Redirecting...</div>;
}
