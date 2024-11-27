import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
	const { logout } = useAuth();

	return (
		<Button
			onClick={logout}
			variant='outline'>
			Logout
		</Button>
	);
}
