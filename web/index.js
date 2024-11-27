const { Html5QrcodeScanner } = require("html5-qrcode");

function startScanner() {
	const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
	scanner.render(
		(decodedText) => {
			console.log("Mã QR:", decodedText);
			scanner.clear();
		},
		(error) => console.error("Scan error:", error),
	);
}

startScanner();
