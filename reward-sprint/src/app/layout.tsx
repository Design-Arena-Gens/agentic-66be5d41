import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { FamilyProvider } from '@/context/FamilyProvider';
import './globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'RewardSprint | Motivation & Rewards Engine',
  description:
    'RewardSprint helps families run a daily clean-time sprint that converts effort into allowances and tangible rewards.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        <FamilyProvider>{children}</FamilyProvider>
      </body>
    </html>
  );
}
