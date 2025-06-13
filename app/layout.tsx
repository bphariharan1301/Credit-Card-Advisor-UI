import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
	title: "Next.js AI Project",
	description: "Next.js project with AI integration",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
