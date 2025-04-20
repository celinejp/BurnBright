import './globals.css';
import { Inter } from 'next/font/google';
import { UserProvider } from '@auth0/nextjs-auth0/client'; // ✅ ADD THIS

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BurnBright',
  description: 'AI Burnout Prevention & Planner for Students',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ✅ WRAP EVERYTHING IN <UserProvider> */}
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
