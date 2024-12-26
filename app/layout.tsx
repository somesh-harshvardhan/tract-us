import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/views/Navbar";
import { createClient } from "@/utils/supabase/server";
import UserProvider from "@/components/context/UserContext";
import { UserResponse } from "@supabase/supabase-js";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Tract Us",
  description: "Assignment",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  let user = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar user={!user.data.user ? "" : user} />
        <UserProvider user={!user.data.user ? "" : user}>
          {children}
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
