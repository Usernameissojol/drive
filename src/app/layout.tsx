import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { initDb } from "@/lib/init-db";

const inter = Inter({ subsets: ["latin"] });

// Initialize database tables on server start
initDb().catch(console.error);

export const metadata: Metadata = {
  title: "DriveLink Studio — Professional Drive Management",
  description: "Securely generate and manage download links for Google Drive files with advanced user isolation and API access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230ea5e9%22/><path d=%22M50 20 L30 55 H50 L40 80 L70 45 H50 L60 20 Z%22 fill=%22white%22/></svg>" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
