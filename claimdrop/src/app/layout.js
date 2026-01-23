"use client"; 
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });


    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* CONDITIONAL HEADER: Only show if NOT logged in */}
        {!session && !isLoading && (
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
        )}
        
        {/* Main Content Area */}
        <main className={!session && !isLoading ? "" : "min-h-screen"}>
          {children}
        </main>

        {/* CONDITIONAL FOOTER: Only show if NOT logged in */}
        {!session && !isLoading && (
          <footer className="border-t py-12 bg-slate-50">
            <div className="container mx-auto px-6 text-center text-slate-500 text-sm font-bold tracking-tight">
              © 2026 CLAIMDROP. BUILT FOR IMPACT.
            </div>
          </footer>
        )}
      </body>
    </html>
  );
}