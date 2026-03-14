import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Store Screenshots — App Store & Play Store Screenshot Generator",
  description:
    "Create professional marketing screenshots for iOS and Android apps. Free, open-source, runs in your browser.",
  keywords: [
    "app store screenshots",
    "play store screenshots",
    "screenshot generator",
    "app marketing",
    "ios screenshots",
    "android screenshots",
    "device mockup",
  ],
  authors: [{ name: "Eksenova", url: "https://eksenova.com" }],
  openGraph: {
    title: "Store Screenshots",
    description: "Professional App Store & Play Store screenshot generator",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
