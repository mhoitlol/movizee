import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movizee",
  description: "Search movie releases by date, genre, region, and cast."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
