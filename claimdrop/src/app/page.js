"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Truck, Heart, ArrowRight, ShieldCheck, BarChart3 } from 'lucide-react';

export default function RootPage() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.push('/dashboard');
      } else {
        setSession(null);
        setIsLoading(false); 
      }
    };
    
    checkUser();
  }, [router]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-green-600 font-black text-2xl tracking-tighter">
          ClaimDrop
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-green-100">


      <main className={`max-w-6xl mx-auto px-6 ${!session ? 'pt-32' : 'pt-12'} pb-24`}>
        {/* 2. STORY-DRIVEN HERO */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-black uppercase tracking-widest mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Real-Time Food Logistics
          </motion.div>
          
          <h2 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
            The Last Mile <br />
            <span className="text-green-600">to Zero Waste.</span>
          </h2>
          
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Every day, perfectly good food is discarded. ClaimDrop turns that surplus into supply, connecting donors with receivers via 
            <span className="text-slate-900 font-bold"> high-frequency real-time logistics.</span>
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

        {/* 3. THE "HOW IT WORKS" STORY */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:scale-[1.02] transition duration-500">
            <div className="h-14 w-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8">
               <Package className="text-green-600" size={28} />
            </div>
            <h4 className="text-xl font-black mb-3 text-slate-900">1. Create a Drop</h4>
            <p className="text-slate-500 font-medium">Businesses broadcast surplus in seconds. A unique security verification code is generated instantly.</p>
          </div>
          
          <div className="p-10 rounded-[3rem] bg-green-600 text-white shadow-2xl shadow-green-200 hover:scale-[1.02] transition duration-500">
            <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-white">
               <Truck size={28} />
            </div>
            <h4 className="text-xl font-black mb-3">2. Live Logistics</h4>
            <p className="text-green-50 font-medium opacity-90">Receivers claim drops and use real-time GPS navigation to bridge the last mile. Donor tracks arrival in real-time.</p>
          </div>

          <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:scale-[1.02] transition duration-500">
            <div className="h-14 w-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8">
               <ShieldCheck className="text-green-600" size={28} />
            </div>
            <h4 className="text-xl font-black mb-3 text-slate-900">3. Verified Impact</h4>
            <p className="text-slate-500 font-medium">A secure 4-digit verification completes the mission. Impact metrics are recorded for a greener planet.</p>
          </div>
        </div>

        {/* 4. REAL-TIME TRUST */}
        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
           <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Built for Trust. <br/> <span className="text-green-400">Powered by Data.</span></h3>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-green-400 shrink-0"><BarChart3 size={20}/></div>
                      <p className="text-slate-400 font-medium">Every kilogram saved is tracked as avoided CO2 emissions in our global ledger.</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-green-400 shrink-0"><Heart size={20}/></div>
                      <p className="text-slate-400 font-medium">Peer-to-peer connection ensures food reaches local communities within minutes of being dropped.</p>
                   </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                 <div className="flex items-center gap-2 mb-6">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">Live Network Activity</span>
                 </div>
                 <div className="space-y-4">
                    {[
                      { item: '10 Pizza Boxes', store: 'Little Italy', time: '2m ago' },
                      { item: '5kg Vegetables', store: 'Fresh Mark', time: '5m ago' },
                      { item: '3 Dozen Eggs', store: 'Baker Street', time: '12m ago' }
                    ].map((activity, i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-white/5">
                         <div>
                            <p className="text-white font-bold text-sm">{activity.item}</p>
                            <p className="text-slate-500 text-xs">{activity.store}</p>
                         </div>
                         <span className="text-green-400 text-[10px] font-bold">{activity.time}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
           <Truck className="absolute -left-12 -bottom-12 text-white/5 w-64 h-64 -rotate-12" />
        </div>
      </main>
    </div>
  );
}