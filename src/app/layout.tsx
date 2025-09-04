import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Alatar QR Generator',
  description: 'Generate QR codes for direct Google Drive file downloads.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22orange%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><rect width=%225%22 height=%225%22 x=%223%22 y=%223%22 rx=%221%22/><rect width=%225%22 height=%225%22 x=%2216%22 y=%223%22 rx=%221%22/><rect width=%225%22 height=%225%22 x=%223%22 y=%2216%22 rx=%221%22/><path d=%22M16 16h2v2h-2zM12 8h4M12 12h2M12 16h2m-4-4h2m-2-4h2m-2-4h2M8 12h2m-2-4h2m-4 8h2%22/></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
