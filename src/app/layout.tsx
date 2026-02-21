import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nova AI",
  description: "Nova AI is a platform for AI-powered interview preparation and job search assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#18181b",
              color: "#fafafa",
              border: "1px solid #27272a",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#18181b",
              },
              style: {
                background: "#18181b",
                color: "#fafafa",
                border: "1px solid #27272a",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#18181b",
              },
              style: {
                background: "#18181b",
                color: "#fafafa",
                border: "1px solid #ef4444",
              },
            },
            loading: {
              style: {
                background: "#18181b",
                color: "#fafafa",
                border: "1px solid #27272a",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
