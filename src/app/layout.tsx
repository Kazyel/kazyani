import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { cn } from "@/lib/utils";

import { Toaster } from "sonner";
import { Navbar } from "@/app/navbar";
import { Footer } from "@/app/footer";
import { DotPattern } from "@/components/magicui/dot-pattern";
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

const STATIC_COLOR = "#232254";
const DARK_COLOR = "#09090b";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const backgroundImage = `radial-gradient(125% 125% at 50% 0%, ${DARK_COLOR} 50%, ${STATIC_COLOR})`;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="grid grid-rows-[1fr_95px] min-h-screen font-[family-name:var(--font-geist-sans)]">
            <main
              style={{ backgroundImage }}
              className="grid grid-rows-[95px_1fr] place-items-center relative col-span-full"
            >
              <Navbar />

              {/* <DotPattern
                className={cn(
                  "[mask-image:radial-gradient(800px_circle_at_center,#FFFFFFbb,transparent)]"
                )}
              /> */}
              {children}
            </main>

            <Footer />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
