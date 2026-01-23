"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import { Loader2, MapPin, Navigation } from 'lucide-react';


const MissionMap = dynamic(() => import('./MissionMap'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-[2rem]" />
});

export default function DonorTracker({ activeDrop }) {
  const [riderPos, setRiderPos] = useState(null);

  const storeLat = parseFloat(activeDrop?.lat);
  const storeLng = parseFloat(activeDrop?.lng);

  useEffect(() => {
    if (!activeDrop?.id) return;

    const channel = supabase.channel(`live_mission_${activeDrop.id}`)
      .on('broadcast', { event: 'location_update' }, ({ payload }) => {

        if (payload?.lat && payload?.lng) {
          setRiderPos({ lat: payload.lat, lng: payload.lng });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeDrop?.id]);


  if (!storeLat || !storeLng) {
    return (
      <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100 text-center">
        <MapPin className="mx-auto text-orange-400 mb-2" />
        <p className="text-orange-700 font-bold">Store Location Not Set</p>
        <p className="text-orange-600/70 text-sm">Please pin your location in the sidebar to enable tracking.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-black flex items-center gap-2">
          <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
          Rider Tracking
        </h3>
        {riderPos && (
          <span className="text-[10px] font-black bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase">
            Live
          </span>
        )}
      </div>
      
      {/* 3. Render map only when data is guaranteed */}
      <MissionMap 
        riderPos={riderPos} 
        storePos={{ lat: storeLat, lng: storeLng }} 
      />
      
      <div className="mt-4 flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
          <Navigation className={riderPos ? "text-green-500" : "text-slate-300"} size={20} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rider Status</p>
          <p className="text-sm font-bold text-slate-900">
            {riderPos ? "Approaching your location..." : "Waiting for rider GPS signal..."}
          </p>
        </div>
      </div>
    </div>
  );
}