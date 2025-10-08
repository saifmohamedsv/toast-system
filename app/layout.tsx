import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toast System",
  description: "Lightweight, accessible toast notifications with variants, positions, and a simple API.",
  metadataBase: new URL("https://toast-system.vercel.app"),
  authors: [{ name: "Saif Mohamed", url: "https://linkedin.com/in/saifmohamedsv" }],
  creator: "Saif Mohamed",
  openGraph: {
    type: "website",
    url: "/",
    title: "Toast System",
    description: "Lightweight, accessible toast notifications with variants, positions, and a simple API.",
    siteName: "Toast System",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toast System",
    description: "Lightweight, accessible toast notifications with variants, positions, and a simple API.",
    creator: "@saifmohamedsv",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
