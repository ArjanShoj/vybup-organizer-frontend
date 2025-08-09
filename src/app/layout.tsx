import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vybup Organizer - Find Perfect Performers',
  description: 'Connect with talented performers for your events. Post gigs, review applications, and manage bookings all in one place.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
      >
        {children}
      </body>
    </html>
  );
}