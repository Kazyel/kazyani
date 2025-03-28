import type { Metadata } from "next";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "sonner";
import Providers from "@/components/providers";

import "./globals.css";

export const shikimoriClient = new ApolloClient({
  uri: "https://shikimori.one/api/graphql",
  cache: new InMemoryCache({ addTypename: false }),
});

export const anilistClient = new ApolloClient({
  uri: "https://graphql.anilist.co",
  cache: new InMemoryCache({ addTypename: false }),
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
