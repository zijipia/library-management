import React from "react";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

export default function ScanButton({ onClick }) {
	return (
		<Button
			onClick={onClick}
			className='flex items-center space-x-2'>
			<QrCode className='w-4 h-4' />
			<span>Scan QR Code</span>
		</Button>
	);
}
