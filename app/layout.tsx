import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Summer Schedule Planner",
  description: "AI-powered family logistics management for summer camps and activities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
