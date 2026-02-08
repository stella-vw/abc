"use client";
import React, { useState } from 'react';
import { CAMPUS_BUILDINGS } from '../../../buildings';

const ACTIVITY_OPTIONS = [
    { id: 'study', label: "Studying" },
    { id: 'eat', label: 'Eating' },
    { id: 'chat', label: 'Chatting' },
    { id: 'other', label: 'Other' },
]

type CreatePinSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (location: {lat: number, lng: number}, activity: string[], duration: number) => void;
};

const CreatePinSidebar = ({ isOpen, onClose, onSubmit }: CreatePinSidebarProps) => {
    // 2. Use the imported array for your state and mapping
    const [selectedLocIndex, setSelectedLocIndex] = useState(0);
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [duration, setDuration] = useState(60);

    // Helper to add or remove a tag from the array
    const toggleActivity = (activityId: string) => {
        setSelectedActivities((prev) =>
        prev.includes(activityId)
            ? prev.filter((a) => a !== activityId) // Remove if already there
            : [...prev, activityId]                // Add if not there
        );
    };

    if (!isOpen) return null;

    return (
    <div style={sidebarStyle}>
      <h2>Add Marker</h2>

      {/* Location Selection */}
      <label>Where are you?</label>
      <select value={selectedLocIndex} onChange={(e) => setSelectedLocIndex(Number(e.target.value))}>
        {CAMPUS_BUILDINGS.map((loc, i) => <option key={i} value={i}>{loc.name}</option>)}
      </select>

      {/* Multi-Select Tag System */}
      <label>What are you doing? (Select all that apply)</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
        {ACTIVITY_OPTIONS.map((opt) => {
          const isSelected = selectedActivities.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => toggleActivity(opt.id)}
              style={{
                padding: '8px 12px',
                borderRadius: '20px',
                border: '1px solid #d32f2f',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#d32f2f' : 'white',
                color: isSelected ? 'white' : '#d32f2f',
                transition: '0.2s'
              }}
            >
              {opt.label}
            </button>
          );
        })}
    </div>

      {/* Submit Button */}
      <button 
        onClick={() => {
          const loc = CAMPUS_BUILDINGS[selectedLocIndex];
          onSubmit({ lat: loc.lat, lng: loc.lng }, selectedActivities, duration);
          onClose();
        }}
        disabled={selectedActivities.length === 0} // Prevent empty tags
        style={{ marginTop: 'auto', padding: '12px', background: '#d32f2f', color: 'white', border: 'none' }}
      >
        Post
      </button>
    </div>
  );
};

const sidebarStyle: React.CSSProperties = {
    position: 'absolute', top: 0, left: 0, height: '100vh', width: '320px',
    background: 'white', zIndex: 1000, padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
};

export default CreatePinSidebar;