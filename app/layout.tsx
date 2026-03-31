import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { DarkModeProvider } from "@/components/DarkModeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sidago CRM",
  description: "Sales management interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <DarkModeProvider><AppShell>{children}</AppShell></DarkModeProvider>
      </body>
    </html>
  );
}
