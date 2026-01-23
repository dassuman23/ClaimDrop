"use client";
import { useState, useEffect } from 'react';
import { getAvailableDrops, claimDrop } from '@/api/publicService';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReceiverDashboard({ onClaimSuccess }) {
  const [drops, setDrops] = useState([]);
  const [claimingId, setClaimingId] = useState(null);

  useEffect(() => {
    loadDrops();
  }, []);

  const loadDrops = async () => {
    const data = await getAvailableDrops();
    setDrops(data || []);
  };

  const handleClaim = async (dropId) => {
    setClaimingId(dropId);
    try {
      const result = await claimDrop(dropId);
      onClaimSuccess(result.drop); 
    } catch (err) {
      alert(err.message);
      setClaimingId(null);
    }
  };

  if (drops.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-lg">No food drops available right now.</p>
        <button onClick={loadDrops} className="mt-4 text-sm text-blue-600 hover:underline">Refresh</button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      <AnimatePresence mode='popLayout'>
        {drops.map((drop, index) => (
          <motion.div
            key={drop.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-slate-800">{drop.title}</h3>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                Available
              </span>
            </div>

            {/* Card Details */}
            <p className="text-slate-500 mb-6 text-sm font-medium">
              {drop.business_name} • <span className="text-slate-800">{drop.quantity}</span>
            </p>

            {/* Smart Button */}
            <button 
              onClick={() => handleClaim(drop.id)}
              disabled={claimingId === drop.id}
              className={`w-full py-3 rounded-2xl font-bold text-white transition-all duration-300 transform
                ${claimingId === drop.id 
                  ? 'bg-slate-700 cursor-wait scale-100 opacity-90' 
                  : 'bg-slate-900 hover:bg-slate-800 hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-900/20 active:scale-95'
                }`}
            >
              {claimingId === drop.id ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Securing...</span>
                </div>
              ) : (
                "Claim Now"
              )}
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}