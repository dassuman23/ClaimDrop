"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Your supabase client
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'DONOR';

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [idNumber, setIdNumber] = useState(''); // Verification Detail

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) router.push('/dashboard');
      else alert(error.message);
    } else {
      // SIGN UP with Metadata (Triggers our SQL Profile Trigger)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: businessName,
            role: role,
            verification_id: idNumber, // Concept: Stored in metadata
          }
        }
      });
      if (!error) alert("Check your email to verify!");
      else alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 text-stone-700">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isLogin ? 'Welcome Back' : `Join as ${role === 'DONOR' ? 'Store' : 'Receiver'}`}
        </h2>

        <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-md transition ${isLogin ? 'bg-white shadow text-black' : 'text-slate-500'}`}
          >Login</button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-md transition ${!isLogin ? 'bg-white shadow text-black' : 'text-slate-500'}`}
          >Register</button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="text-sm font-semibold">
                  {role === 'DONOR' ? 'Business Name' : 'Organization Name'}
                </label>
                <input required value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full p-3 border rounded-lg mt-1" placeholder={role === 'DONOR' ? 'Fresh Mart' : 'Disha Foundation'} />
              </div>
              <div>
                <label className="text-sm font-semibold">
                  {role === 'DONOR' ? 'Store License Number' : 'Delivery ID / NGO Cert'}
                </label>
                <input required value={idNumber} onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full p-3 border rounded-lg mt-1" placeholder="Verification code" />
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-semibold">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1" placeholder="you@company.com" />
          </div>

          <div>
            <label className="text-sm font-semibold">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1" placeholder="••••••••" />
          </div>

          <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition">
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Submit for Verification'}
          </button>
        </form>
      </div>
    </div>
  );
}