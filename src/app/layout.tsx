import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SNAP! 2026 Spring Quiz",
  description: "Test your SNAP photo day knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
