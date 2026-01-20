"use client";
import { useState } from 'react';
import { verifyPickup } from '@/api/publicService'; // Importing our centralized service
import { motion, AnimatePresence } from 'framer-motion'; // Using Framer Motion as planned
import { Navigation, ShieldCheck, Map, Phone, AlertCircle } from 'lucide-react'; // Using Lucide icons
import { DotLottieReact } from '@lottiefiles/dotlottie-react'; // Using DotLottie for animations

export default function ActiveMissionView({ activeDrop, onMissionComplete }) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setIsVerifying(true);
    setError("");
    try {
      // Calling the backend verification service
      const result = await verifyPickup(activeDrop.id, otp);
      if (result.success) {
        setShowSuccess(true);
        // Delay the reset to show the success animation
        setTimeout(() => onMissionComplete(), 3500); 
      }
    } catch (err) {
      setError(err.message || "Invalid verification code.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center min-h-[60vh]">
        <DotLottieReact 
          src="https://lottie.host/your-success-animation.lottie" // Replace with your chosen success Lottie
          autoplay 
          loop={false}
          className="h-64 w-64"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <h2 className="text-3xl font-black text-slate-900">Handover Successful!</h2>
          <p className="text-slate-500 mt-2 font-medium">Thank you for helping reduce food waste. Your impact has been recorded.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto space-y-6 pb-20"
    >
      {/* Navigation Card */}
      <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
            Mission in Progress
          </span>
          <h3 className="text-3xl font-black mb-2">{activeDrop.business_name}</h3>
          <p className="text-slate-400 mb-8 max-w-xs">{activeDrop.address || 'Navigate to the donor location to collect items.'}</p>
          
          <div className="flex gap-3">
            <button className="flex-1 bg-white text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition shadow-lg">
              <Map size={20} /> Google Maps
            </button>
            <button className="bg-slate-800 p-4 rounded-2xl hover:bg-slate-700 transition">
              <Phone size={20} className="text-slate-300" />
            </button>
          </div>
        </div>
        {/* Background Decorative Icon */}
        <Navigation className="absolute -right-8 -bottom-8 text-white/5 w-48 h-48 rotate-12" />
      </div>

      {/* Verification Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
        <div className="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="text-green-600" size={32} />
        </div>
        <h4 className="text-2xl font-bold text-slate-900 mb-2">Security Verification</h4>
        <p className="text-slate-500 mb-8">Enter the unique 4-digit code provided by the store manager to confirm the collection of <span className="text-slate-900 font-bold">{activeDrop.title}</span>.</p>
        
        <div className="relative">
          <input 
            type="text" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Ensure only numbers
            maxLength={4} 
            placeholder="0 0 0 0"
            className={`text-5xl font-black tracking-[1.5rem] text-center w-full p-6 bg-slate-50 border-2 rounded-3xl outline-none transition-all ${error ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-100 focus:border-green-500'}`}
          />
          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-500 text-sm font-bold mt-4 flex items-center justify-center gap-1"
              >
                <AlertCircle size={14} /> {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={handleVerify} 
          disabled={otp.length < 4 || isVerifying}
          className="w-full mt-8 bg-green-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl hover:bg-green-700 disabled:opacity-50 disabled:grayscale transition active:scale-95"
        >
          {isVerifying ? "Verifying..." : "Confirm Collection"}
        </button>
      </div>
    </motion.div>
  );
}