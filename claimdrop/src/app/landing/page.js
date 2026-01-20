import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <nav className="flex justify-between p-6 items-center border-b">
        <h1 className="text-2xl font-bold text-green-600 tracking-tighter">ClaimDrop</h1>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 text-gray-600 font-medium">Login</Link>
          <Link href="/login?tab=signup" className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium shadow-md">Get Started</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6">
          The Last Mile Bridge for <span className="text-green-600">Surplus Food.</span>
        </h2>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          ClaimDrop connects grocery stores and restaurants with verified distributors to ensure zero food waste. Real-time, peer-to-peer, and community-driven.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
          <div className="p-8 border rounded-2xl bg-slate-50 text-left md:w-1/2">
            <h3 className="text-2xl font-bold mb-2">For Businesses</h3>
            <p className="text-slate-600 mb-4">Don't let good food go to waste. Drop your surplus and get it claimed by verified receivers in minutes.</p>
            <Link href="/login?role=DONOR" className="text-green-600 font-bold hover:underline">Register your Store →</Link>
          </div>
          <div className="p-8 border rounded-2xl bg-slate-50 text-left md:w-1/2">
            <h3 className="text-2xl font-bold mb-2">For Receivers</h3>
            <p className="text-slate-600 mb-4">Help bridge the gap. Access real-time food drops and deliver them to those in need.</p>
            <Link href="/login?role=CLAIMER" className="text-green-600 font-bold hover:underline">Join the Network →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}