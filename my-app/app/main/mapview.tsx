"use client";

import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import CreatePinSidebar from './createsidebar';

// 1. Define the shape of our Marker data
interface OfficeHourMarker {
  id: string;
  lat: number;
  lng: number;
  activities: string[]; // This is now an array because of your tag system!
  duration: number;
  createdAt: number;
}

const CampusMap = () => {
  // 2. State Management
  const [markers, setMarkers] = useState<OfficeHourMarker[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // 3. Logic to handle the data coming BACK from the sidebar
  const handleSidebarSubmit = (location: {lat: number, lng: number}, activities: string[], duration: number) => {
    const newMarker: OfficeHourMarker = {
      id: Math.random().toString(36).substr(2, 9),
      lat: location.lat,
      lng: location.lng,
      activities: activities,
      duration: duration,
      createdAt: Date.now()
    };

    // Add the new marker to our list
    setMarkers((prev) => [...prev, newMarker]);
    
    // Close the sidebar automatically
    setSidebarOpen(false);
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      
      {/* 4. The Sidebar (The Form) */}
      <CreatePinSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onSubmit={handleSidebarSubmit} 
      />

      {/* 5. The Add Button (The Trigger) */}
      <button 
        onClick={() => setSidebarOpen(true)}
        style={fabStyle}
      >
        +
      </button>

      {/* 6. The Map (The View) */}
      <APIProvider apiKey={'' as string}>
        <Map
          defaultZoom={16}
          defaultCenter={{ lat: 45.5048, lng: -73.5772 }} // McGill University
          mapId="9086dea976fc7f72a31d941c" // Use your actual Map ID for Advanced Markers
        >
          {markers.map((marker) => (
            <AdvancedMarker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
            >
              {/* You can customize the Pin color based on the first activity! */}
              <Pin 
                background={marker.activities.includes('help') ? '#e74c3c' : '#2ecc71'} 
                glyphColor={'#fff'} 
                borderColor={'#000'} 
              />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
};

// 7. Styling for the Floating Action Button
const fabStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '30px',
  right: '30px',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#d32f2f', // McGill Red
  color: 'white',
  fontSize: '32px',
  border: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  cursor: 'pointer',
  zIndex: 10, // Ensure it stays above the map
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

export default CampusMap;
