import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 bg-white">
        <div className="container px-6 mx-auto text-center">
          <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-6 inline-block">
            Hackathon MVP v1.0
          </span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Turn your surplus into <br />
            <span className="text-green-600 italic">someone's meal.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10">
            ClaimDrop is the real-time bridge for the "Last Mile." We connect grocery stores with surplus food to verified receivers in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login?role=DONOR" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl">
              I have surplus food
            </Link>
            <Link href="/login?role=CLAIMER" className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition">
              I want to deliver
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full py-20 bg-slate-50 border-y">
        <div className="container px-6 mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon="⚡"
              title="Real-Time Drops"
              desc="Push notifications and live map updates the moment food becomes available."
            />
            <FeatureCard 
              icon="🛡️"
              title="Verified Users"
              desc="Every store and receiver is vetted with license verification for safety."
            />
            <FeatureCard 
              icon="📊"
              title="Impact Tracking"
              desc="Detailed logs of meals saved and carbon footprint reduced."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}