"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "./context/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingProvider } from "./context/loadingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();

  useEffect(() => {
    // Ensure this runs only on the client
    // if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login"); // Redirect to login page
      // }
    }
  }, [router]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider>

          <UserProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </UserProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
