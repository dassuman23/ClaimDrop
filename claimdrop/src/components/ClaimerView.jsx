"use client";
import { useState, useEffect } from 'react';
import { getAvailableDrops } from '@/api/publicService';
import ReceiverDashboard from './ReceiverDashboard'; // Discovery view
import ActiveMissionView from './ActiveMissionView'; // Mission view

export default function ClaimerView({ profile }) {
  const [activeClaim, setActiveClaim] = useState(null); // The "Switch"

  // This function is passed to ReceiverDashboard
  const onClaimSuccess = (claimedDrop) => {
    setActiveClaim(claimedDrop); // This triggers the switch to ActiveMissionView
  };

  // This function is passed to ActiveMissionView
  const onMissionComplete = () => {
    setActiveClaim(null); // This triggers the switch back to ReceiverDashboard
  };

  return (
    <div className="min-h-screen">
      {activeClaim ? (
        <ActiveMissionView 
          activeDrop={activeClaim} 
          onMissionComplete={onMissionComplete} 
        />
      ) : (
        <ReceiverDashboard 
          profile={profile} 
          onClaimSuccess={onClaimSuccess} 
        />
      )}
    </div>
  );
}