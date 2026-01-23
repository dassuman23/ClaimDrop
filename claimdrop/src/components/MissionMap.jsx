"use client";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function RoutingMachine({ riderPos, storePos }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !riderPos || !storePos) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(riderPos.lat, riderPos.lng),
        L.latLng(storePos.lat, storePos.lng)
      ],
      lineOptions: {
        styles: [{ color: '#22c55e', weight: 6, opacity: 0.8 }]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      createMarker: () => null,
    });

    try {
      routingControl.addTo(map);
    } catch (err) {
      console.warn("Could not add routing control:", err.message);
    }


    return () => {

      if (map && map._container && routingControl) {
        try {
          map.removeControl(routingControl);
        } catch (e) {

          console.debug("Cleanup safely ignored");
        }
      }
    };
  }, [map, riderPos?.lat, riderPos?.lng, storePos?.lat, storePos?.lng]);

  return null;
}

export default function MissionMap({ riderPos, storePos }) {
  if (!storePos?.lat || !storePos?.lng) return null;

  return (
    <div className="h-[300px] w-full rounded-[2rem] overflow-hidden border-4 border-white shadow-xl relative z-0">
      <MapContainer 
        center={[storePos.lat, storePos.lng]} 
        zoom={13} 
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        
        {/* Store Marker */}
        <Marker position={[storePos.lat, storePos.lng]}>
          <Popup>Pickup Location</Popup>
        </Marker>

        {/* Rider Marker (Only if GPS is active) */}
        {riderPos && (
          <Marker position={[riderPos.lat, riderPos.lng]}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* The Route Path Line */}
        {riderPos && <RoutingMachine riderPos={riderPos} storePos={storePos} />}
      </MapContainer>
    </div>
  );
}