'use client';
import { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function MapComponent() {
  const placesLib = useMapsLibrary('places');
  const map = useMap();
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);
  const [venue, setVenue] = useState<google.maps.places.Place | null>(null);

  useEffect(() => {
    if (!placesLib || !map) return;

    placesLib.Place.searchByText({
      textQuery: 'Hotels near Kotoka International Airport, Accra',
      fields: ['displayName', 'location', 'formattedAddress'],
        maxResultCount: 8,
    }).then(({ places }) => setPlaces(places));
    
    placesLib.Place.searchByText({
      textQuery: 'UPSA Auditorium, Accra',
      fields: ['displayName', 'location', 'formattedAddress'],
      maxResultCount: 1,
    }).then(({ places }) => {
        if (places && places.length > 0) {
            setVenue(places[0]);
            map.panTo(places[0].location!);
        }
    });

  }, [placesLib, map]);

  return (
    <>
      {venue && venue.location && (
        <AdvancedMarker position={venue.location} title={venue.displayName || 'Venue'}>
            <Pin background="#CE1126" glyphColor="#fff" borderColor="#CE1126" />
        </AdvancedMarker>
      )}
      {places.map((p, i) => {
        if (!p.location) return null;
        return (
          <AdvancedMarker key={p.id || i} position={p.location} title={p.displayName || 'Hotel'}>
            <Pin background="#D4AF37" glyphColor="#000" borderColor="#D4AF37" scale={0.8} />
          </AdvancedMarker>
        );
      })}
    </>
  );
}

export default function AccommodationMap() {
  if (!hasValidKey) {
    return (
      <div className="w-full h-80 bg-black/50 border border-white/10 rounded-xl flex items-center justify-center text-center p-6">
        <div>
          <h3 className="text-xl font-bold text-wff-gold mb-2">Map Unavailable</h3>
          <p className="text-white/60 text-sm">Please configure the GOOGLE_MAPS_API_KEY to view locations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-white/10 relative">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={{lat: 5.6037, lng: -0.1870}} // Accra general
          defaultZoom={12}
          mapId="WFF_GHANA_MAP"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{width: '100%', height: '100%'}}
          gestureHandling="cooperative"
        >
          <MapComponent />
        </Map>
      </APIProvider>
    </div>
  );
}
