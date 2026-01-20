import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ClaimDrop | Bridging the Last Mile for Surplus Food',
  description: 'A real-time platform connecting stores with verified food claimers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-6">
            <Link href="/" className="text-2xl font-black text-green-600 tracking-tighter">
              ClaimDrop
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-green-600 transition">
                Sign In
              </Link>
              <Link 
                href="/login?tab=signup" 
                className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-green-700 transition active:scale-95"
              >
                Join Now
              </Link>
            </nav>
          </div>
        </header>
        
        <main>{children}</main>

        <footer className="border-t py-12 bg-slate-50">
          <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
            © 2026 ClaimDrop. Built for Impact.
          </div>
        </footer>
      </body>
    </html>
  );
}