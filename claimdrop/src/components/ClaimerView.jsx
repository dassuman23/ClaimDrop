"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ReceiverDashboard from './ReceiverDashboard'; 
import ActiveMissionView from './ActiveMissionView'; 
import ImpactPage from './ImpactPage';

export default function ClaimerView({ profile }) {
  const [viewState, setViewState] = useState('DISCOVERY'); 
  const [activeDrop, setActiveDrop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    if (profile?.id) {
      restoreMissionSession();
    } else {
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [profile?.id]);

  async function restoreMissionSession() {
  if (!profile?.id) return setIsLoading(false);

  try {
    const { data, error } = await supabase
      .from('drops')
      .select(`
        *,
        profiles:donor_id (
          business_name,
          address,
          lat,
          lng
        )
      `)
      .eq('claimer_id', profile.id)
      .eq('status', 'CLAIMED')
      .order('created_at', { ascending: false })
      .limit(1); 

    if (error) throw error;


    if (data && data.length > 0) {
      const activeMission = data[0];


      const recoveredMission = {
        ...activeMission,
        business_name: activeMission.profiles?.business_name,
        address: activeMission.profiles?.address,
        lat: activeMission.profiles?.lat,
        lng: activeMission.profiles?.lng
      };
      
      setActiveDrop(recoveredMission);
      setViewState('MISSION');
    } else {

      setViewState('DISCOVERY');
    }
  } catch (err) {
    console.error("Session recovery error:", err.message);
  } finally {
    setIsLoading(false);
  }
}


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        <p className="text-slate-500 font-bold animate-pulse">Syncing Mission Status...</p>
      </div>
    );
  }

  return (
    <div>
      {viewState === 'DISCOVERY' && (
        <ReceiverDashboard 
          onClaimSuccess={(drop) => { 
            setActiveDrop(drop); 
            setViewState('MISSION'); 
          }} 
        />
      )}

      {viewState === 'MISSION' && activeDrop && (
        <ActiveMissionView 
          activeDrop={activeDrop} 
          onMissionComplete={() => {
              setActiveDrop(null);
              setViewState('IMPACT');
          }} 
        />
      )}

      {viewState === 'IMPACT' && (
        <ImpactPage 
          onRestart={() => setViewState('DISCOVERY')} 
        />
      )}
    </div>
  );
}