import type { Metadata, Viewport } from "next";
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
  title: "PlayFit Instructor",
  description: "Interactive Learning Platform by PlayFit - Instructor Portal",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PlayFit Instructor',
  },
  icons: {
    icon: [
      { url: '/logo.jpg', sizes: '1254x1254', type: 'image/jpeg' },
      { url: '/logo.jpg', sizes: '1254x1254', type: 'image/jpeg' }
    ],
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#1E88E5',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
