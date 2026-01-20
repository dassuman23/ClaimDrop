"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DonorView from '@/components/DonorView';
import ClaimerView from '@/components/ClaimerView';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    };
    checkUser();
  }, [router]);

  if (loading) return <div className="p-20 text-center font-bold text-xl">Loading your workspace...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
            <p className="text-slate-500 font-medium">Welcome back, {profile.business_name}</p>
          </div>
          <button 
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            className="text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg"
          >Sign Out</button>
        </header>

        {profile.role === 'DONOR' ? <DonorView profile={profile} /> : <ClaimerView profile={profile} />}
      </div>
    </div>
  );
}