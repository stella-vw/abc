"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Ghost,
  User as UserIcon,
  X,
  Plus,
  ArrowLeft,
  Camera,
  Search,
  BookOpen,
  Coffee,
  Dumbbell,
  MessageCircle,
} from 'lucide-react';

// --- Types ---

type Location = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'cafe' | 'library' | 'study' | 'gym' | 'other';
};

type User = {
  id: string;
  handle: string;
  major: string;
  bio: string;
  photoUrl: string | null;
  isGhost: boolean;
  topSpots: Location[];
};

type Flag = {
  id: string;
  userId: string;
  location: Location;
  startTime: number;
  durationMinutes: number;
  status: string; // "Cramming for COMP 202"
  vibe: 'study' | 'gym' | 'cafe' | 'chill';
};

// --- Mock Data ---

const INITIAL_CAMERA = {
  center: { lat: 45.5048, lng: -73.5772 }, // McGill
  zoom: 16
};

// Default user since backend handles auth
const CURRENT_USER: User = {
  id: 'user-123',
  handle: 'mcgill_student',
  major: 'Computer Science',
  bio: 'Just joined the garden 🌱',
  photoUrl: null,
  isGhost: false,
  topSpots: []
};

// --- Components ---

const Avatar = ({ url, size = 'md', className = '', fallbackText }: { url: string | null, size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl', className?: string, fallbackText?: string }) => {
  const sizePx = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-20 h-20', xl: 'w-32 h-32', '2xl': 'w-40 h-40' } as const;
  
  return (
    <div className={`rounded-full overflow-hidden bg-gray-200 border-gray-100 flex-shrink-0 flex items-center justify-center ${sizePx[size]} ${className}`}>
      {url ? (
        <img src={url} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <span className="text-gray-400 font-bold text-lg">{fallbackText ? fallbackText[0] : <UserIcon />}</span>
      )}
    </div>
  );
};

// --- Profile Page ---

const ProfilePage = ({ user, onSave, onBack }: { user: User, onSave: (u: User) => void, onBack: () => void }) => {
  const [formData, setFormData] = useState(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File too large. Please choose an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({ ...prev, photoUrl: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="absolute inset-0 z-[4000] bg-gray-50 flex flex-col slide-in-right overflow-hidden">
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between z-10 sticky top-0">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg text-gray-800">Edit Profile</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); onBack(); }} className="space-y-8 max-w-lg mx-auto">
          <div className="flex flex-col items-center">
            <div className="relative group">
               <Avatar url={formData.photoUrl} size="2xl" fallbackText={formData.handle} className="shadow-2xl border-4 border-white" />
               <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
               <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-black transition-transform active:scale-95"
               >
                  <Camera size={20} />
               </button>
            </div>
            <p className="text-sm text-gray-500 mt-4 font-medium">Tap icon to change photo</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
             <input type="text" value={formData.handle} onChange={e => setFormData({...formData, handle:e.target.value})} placeholder="Handle" className="w-full px-4 py-3 border rounded-xl" />
             <input type="text" value={formData.major} onChange={e => setFormData({...formData, major:e.target.value})} placeholder="Major" className="w-full px-4 py-3 border rounded-xl" />
             <textarea value={formData.bio} onChange={e => setFormData({...formData, bio:e.target.value})} placeholder="Bio" className="w-full px-4 py-3 border rounded-xl" />
          </div>
          <button type="submit" className="w-full bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg">Save Profile</button>
        </form>
      </div>
    </div>
  );
};

const ProfilePopup = ({ user, onClose }: { user: User, onClose: () => void }) => (
  <div className="absolute inset-0 z-[3000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-white w-full max-w-xs rounded-3xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
      <div className="relative h-24 bg-red-600">
        <button onClick={onClose} className="absolute top-3 right-3 text-white/80 hover:text-white p-1 bg-black/10 rounded-full">
          <X size={20} />
        </button>
      </div>
      <div className="flex flex-col items-center -mt-16 px-6 pb-6">
        <Avatar url={user.photoUrl} size="xl" fallbackText={user.handle} className="border-4 border-white shadow-lg bg-white mb-3" />
        <h2 className="text-xl font-black text-gray-900 text-center">{user.handle}</h2>
        <p className="text-red-600 font-medium text-sm mb-4">{user.major}</p>
        <p className="text-gray-600 text-center text-sm leading-relaxed mb-6">"{user.bio}"</p>
      </div>
    </div>
  </div>
);

// --- MAIN MAP COMPONENT ---

const Dashboard = () => {
  // State - Initialized with default user immediately
  const [user, setUser] = useState<User>(CURRENT_USER);
  const [myFlag, setMyFlag] = useState<Flag | null>(null);
  const [isPlanting, setIsPlanting] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Location | null>(null);
  
  // New Flag State
  const [comment, setComment] = useState('');
  const [vibe, setVibe] = useState<'study' | 'gym' | 'cafe' | 'chill'>('study');
  const [duration, setDuration] = useState(60);

  // Map Hooks
  const map = useMap();
  const placesLibrary = useMapsLibrary('places');

  // Handle Planting a Flag
  const handlePlantFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlace || !user) return;

    const newFlag: Flag = {
      id: `flag-${Date.now()}`,
      userId: user.id,
      location: selectedPlace,
      startTime: Date.now(),
      durationMinutes: duration,
      status: comment || vibe, // Fallback to vibe if comment is empty
      vibe: vibe,
    };
    
    setMyFlag(newFlag);
    setIsPlanting(false);
    setComment('');
    setSearchQuery('');
    setPredictions([]);
    
    // Pan map to new location
    if (map) {
      map.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng });
      map.setZoom(18);
    }
  };

  // --- GOOGLE PLACES AUTOCOMPLETE ---
  useEffect(() => {
    if (!placesLibrary || !searchQuery || searchQuery.length < 2) {
      setPredictions([]);
      return;
    }

    const service = new placesLibrary.AutocompleteService();
    const center = map ? map.getCenter() : INITIAL_CAMERA.center;
    
    const request: google.maps.places.AutocompletionRequest = {
      input: searchQuery,
      locationBias: {
        radius: 5000, 
        center: center as google.maps.LatLngLiteral 
      },
      componentRestrictions: { country: 'ca' }
    };

    service.getPlacePredictions(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setPredictions(results);
      } else {
        setPredictions([]);
      }
    });
  }, [searchQuery, placesLibrary, map]);

  const handleSelectPrediction = (placeId: string) => {
    if (!placesLibrary || !map) return;

    const service = new placesLibrary.PlacesService(map);
    service.getDetails({
      placeId: placeId,
      fields: ['name', 'geometry', 'types']
    }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
        
        setSelectedPlace({
          id: placeId,
          name: place.name || 'Unknown',
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          type: 'other'
        });

        setSearchQuery(place.name || '');
        setPredictions([]);
      }
    });
  };

  return (
    <div className="relative h-screen w-screen flex flex-col overflow-hidden bg-gray-100">
      
      {/* 1. Header (Floating) */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto bg-white/90 backdrop-blur shadow-md p-2 rounded-2xl flex items-center gap-2">
            <div className="bg-red-600 w-10 h-10 rounded-xl flex items-center justify-center">
                <MapPin className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-gray-800 pr-2 hidden sm:block">The Casual Hang</span>
        </div>

        <div className="pointer-events-auto flex gap-3">
             <button 
                onClick={() => setUser({...user, isGhost: !user.isGhost})}
                className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-bold transition-all shadow-md ${user.isGhost ? 'bg-gray-900 text-white' : 'bg-white text-gray-600'}`}
            >
                <Ghost size={18} />
            </button>
            <button onClick={() => setIsEditingProfile(true)}>
                <Avatar url={user.photoUrl} size="md" fallbackText={user.handle} className="shadow-md border-2 border-white" />
            </button>
        </div>
      </div>

      {/* 2. Google Map */}
      <div className="w-full h-full">
        <Map
          defaultZoom={16}
          defaultCenter={INITIAL_CAMERA.center}
          mapId="DEMO_MAP_ID" 
          disableDefaultUI={true}
          className="w-full h-full"
        >
            {/* Render My Flag */}
            {myFlag && !user.isGhost && (
                <AdvancedMarker 
                    position={{ lat: myFlag.location.lat, lng: myFlag.location.lng }}
                    onClick={() => setIsEditingProfile(true)}
                >
                   {/* Custom HTML Pin */}
                    <div className="relative flex flex-col items-center group cursor-pointer hover:z-50">
                        <div className="bg-white px-3 py-1 rounded-full shadow-md text-[11px] font-extrabold text-gray-800 border border-gray-100 mb-1 whitespace-nowrap">
                            {myFlag.status}
                        </div>
                        <div className="w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white relative z-10">
                            <Avatar url={user.photoUrl} size="lg" fallbackText={user.handle} className="w-full h-full" />
                        </div>
                        <div className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full -mt-2 relative z-20 font-bold tracking-wide shadow-sm">
                            YOU
                        </div>
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white absolute top-[calc(100%-20px)] shadow-sm"></div>
                    </div>
                </AdvancedMarker>
            )}
        </Map>
      </div>

      {/* 3. Floating Action Button (FAB) */}
      {!isPlanting && !isEditingProfile && (
        <div className="absolute bottom-8 right-6 z-20">
            {!myFlag && !user.isGhost ? (
                <button 
                    onClick={() => setIsPlanting(true)}
                    className="bg-red-600 hover:bg-red-700 text-white p-5 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-105 transition-all"
                >
                    <Plus size={32} />
                </button>
            ) : (
                user.isGhost && (
                    <div className="bg-gray-900/80 backdrop-blur text-white px-6 py-3 rounded-full shadow-xl font-medium text-sm">
                        Ghost Mode Active 👻
                    </div>
                )
            )}
        </div>
      )}

      {/* 4. "New Session" Modal (UPDATED UI) */}
      {isPlanting && (
        <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-sm flex flex-col justify-end sm:justify-center p-4">
            <div className="bg-white w-full max-w-lg mx-auto rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-black text-gray-900">New Session</h2>
                    <button onClick={() => setIsPlanting(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    <form onSubmit={handlePlantFlag} className="space-y-6">
                        
                        {/* 1. Location Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                                <input 
                                    type="text"
                                    placeholder="Search (e.g. Redpath)"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-base font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {/* Dropdown Suggestions */}
                                {predictions.length > 0 && (
                                  <ul className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-gray-50">
                                    {predictions.map((p) => (
                                      <li 
                                        key={p.place_id} 
                                        onClick={() => handleSelectPrediction(p.place_id)}
                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                      >
                                        <p className="font-bold text-gray-800 text-sm truncate">{p.structured_formatting.main_text}</p>
                                        <p className="text-xs text-gray-500 truncate">{p.structured_formatting.secondary_text}</p>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                            </div>
                        </div>

                        {/* 2. Vibe Check (Buttons) */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vibe Check</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'study', label: 'Study', icon: <BookOpen size={18} /> },
                                    { id: 'gym', label: 'Gym', icon: <Dumbbell size={18} /> },
                                    { id: 'cafe', label: 'Cafe', icon: <Coffee size={18} /> },
                                    { id: 'chill', label: 'Chill', icon: <MessageCircle size={18} /> },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => setVibe(option.id as any)}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                                            vibe === option.id 
                                            ? 'bg-gray-900 text-white shadow-md transform scale-[1.02]' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {option.icon}
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Comment Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Comment (Optional)</label>
                            <textarea 
                                placeholder="What's the plan? (e.g. cramming for COMP 202)"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm min-h-[80px]"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                maxLength={80}
                            />
                        </div>

                        {/* 4. Duration */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Duration</label>
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                {[30, 60, 120, 180, 240, 300].map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setDuration(m)}
                                        className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                            duration === m 
                                            ? 'bg-red-600 text-white shadow-md' 
                                            : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {m < 60 ? `${m}m` : `${m/60}h`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 5. Contact Method (Static UI for now) */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Method</label>
                            <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl flex justify-between items-center cursor-not-allowed opacity-70">
                                <span className="text-sm font-medium text-gray-700">Don't share contact</span>
                                <div className="w-4 h-4 bg-black rounded-full"></div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2">Add socials in your profile to share them here.</p>
                        </div>
                    </form>
                </div>

                {/* Footer Action Button */}
                <div className="p-6 border-t border-gray-100 bg-white">
                     <button 
                        onClick={handlePlantFlag}
                        disabled={!selectedPlace}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${selectedPlace ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-200 text-gray-400'}`}
                    >
                        {selectedPlace ? 'Start Session' : 'Select a Location First'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Pages & Popups */}
      {isEditingProfile && user && <ProfilePage user={user} onSave={setUser} onBack={() => setIsEditingProfile(false)} />}
      {viewingProfile && <ProfilePopup user={viewingProfile} onClose={() => setViewingProfile(null)} />}
    </div>
  );
};

// --- WRAPPER ---

export default function App() {
  return (
    // This is the key you provided for Google Maps (starting with AIza...m2Q)
    <APIProvider apiKey="AIzaSyDAGWOcRdniYbT7aVnV0WPvQMj53mk8m2Q">
      <Dashboard />
    </APIProvider>
  );
}
