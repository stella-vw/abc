"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CAMPUS_BUILDINGS } from '../../../buildings';
import { useRouter } from 'next/navigation';

import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import {
  MapPin,
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

// type Location = {
//   id: string;
//   name: string;
//   lat: number;
//   lng: number;
//   type: 'cafe' | 'library' | 'study' | 'gym' | 'other';
// };

type User = {
  username: string;
  handle: string;
  major: string;
  bio: string;
  profilePic: string | null;
  topSpots: Location[];
};

type Flag = {
  id: string;
  authorId: string;
  buildingIndex: number;
  startTime: number;
  durationMinutes: number;
  status: string; 
  vibe: 'study' | 'gym' | 'cafe' | 'chill';
  socmed: string;
};

// --- Mock Data ---

const INITIAL_CAMERA = {
  center: { lat: 45.5048, lng: -73.5772 }, // McGill
  zoom: 16
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
        setFormData(prev => ({ ...prev, profilePic: ev.target?.result as string }));
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
               <Avatar url={formData.profilePic} size="2xl" fallbackText={formData.handle} className="shadow-2xl border-4 border-white" />
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
        <Avatar url={user.profilePic} size="xl" fallbackText={user.handle} className="border-4 border-white shadow-lg bg-white mb-3" />
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
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [myFlag, setMyFlag] = useState<Flag | null>(null);
  const [isPlanting, setIsPlanting] = useState(false);
  const [allFlags, setAllFlags] = useState<any[]>([]);
  
  useEffect(() => {
    const username = localStorage.getItem("loggedUser");
    if (!username) {
      router.push('/login'); // Send to login if not found
      return;
    }

    fetch(`/api/profile/get?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          // Map your DB fields to your User type
          setUser({
            username: data._id.toString() || 'user-123',
            handle: data.username || data.name,
            major: data.major || '',
            bio: data.aboutMe || '',
            profilePic: data.profilePic || null,
            topSpots: []
          });
        }
      })
      .catch(err => console.error("Failed to load user:", err));
  }, [router]);

    // 1. Add this useEffect to fetch all posts from the DB
    useEffect(() => {
    const fetchAllPosts = async () => {
        try {
        // Use your actual API endpoint
        const response = await fetch('/api/posts'); 
        if (response.ok) {
            const data = await response.json();
            // MongoDB returns an array; set it to state
            setAllFlags(data);
        }
        } catch (err) {
        console.error("Failed to fetch posts from database:", err);
        }
    };

    // Run immediately on load
    fetchAllPosts();

    // Refresh every 15 seconds so the map feels "live"
    const interval = setInterval(fetchAllPosts, 15000);
    return () => clearInterval(interval);
    }, []);
  
  // Search State
//   const [searchQuery, setSearchQuery] = useState('');
//   const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [selectedPlace, setSelectedPlace] = useState(0);
  
  // New Flag State
  const [comment, setComment] = useState('');
  const [vibe, setVibe] = useState<'study' | 'gym' | 'cafe' | 'chill'>('study');
  const [duration, setDuration] = useState(60);
  const [socmed, setSocmed] = useState("");

  // Map Hooks
  const map = useMap();
  const placesLibrary = useMapsLibrary('places');

  // Handle Planting a Flag
  const handlePlantFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlace || !user) return;

    const postData = {
      title: comment || vibe,
      buildingName: selectedPlace,
      type: vibe,
      location: {
        type: 'Point',
        coordinates: [CAMPUS_BUILDINGS[selectedPlace].lng, CAMPUS_BUILDINGS[selectedPlace].lat]
      },
      authorId: user.username,
      authorName: user.handle,
      authorPic: user.profilePic
    };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const savedPost = await response.json();
        
        const newFlag: Flag = {
          id: savedPost._id,
          authorId: user.username,
          buildingIndex: selectedPlace,
          startTime: Date.now(),
          durationMinutes: duration,
          status: savedPost.title,
          vibe: vibe,
          socmed: socmed,
        };
        
        setMyFlag(newFlag);
        setIsPlanting(false);
        setComment('');
        // setSearchQuery('');
        // setPredictions([]);

        if (map) {
          map.panTo({ lat: CAMPUS_BUILDINGS[selectedPlace].lat, lng: CAMPUS_BUILDINGS[selectedPlace].lng });
          map.setZoom(18);
        }
      } else {
        alert("Failed to save post to database.");
      }
    } catch (err) {
      console.error("Error connecting to backend:", err);
      alert("Backend server is not responding.");
    } 
  }; 

  // The final check before rendering
  if (!user) return <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-gray-400 font-bold">Loading OnMyWay!...</div>;

  return (
    <div className="relative h-screen w-screen flex flex-col overflow-hidden bg-gray-100">
      
      {/* 1. Header (Floating) */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto bg-white/90 backdrop-blur shadow-md p-2 rounded-2xl flex items-center gap-2">
            <div className="bg-red-600 w-10 h-10 rounded-xl flex items-center justify-center">
                <MapPin className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-gray-800 pr-2 hidden sm:block">OnMyWay!</span>
        </div>
      </div>

      {/* 2. Google Map */}
    <div className="w-full h-full">
    <Map
        defaultZoom={16}
        defaultCenter={INITIAL_CAMERA.center}
        mapId="9086dea976fc7f72a31d941c" 
        disableDefaultUI={true}
        className="w-full h-full"
    >
         

        {/* A. Render ALL Existing Pins from Database */}
        {allFlags
            .filter((flag) => {
                // 1. Convert everything to strings to prevent ID vs String mismatches
                const flagAuthorId = String(flag.authorId || flag.author || "");
                const myId = String(user?.username || "");

                // 2. If they match, this is ME, so return false to hide from "All Flags"
                return flagAuthorId !== myId;
            })
            .map((flag) => (
        <AdvancedMarker 
            key={flag._id} 
            position={{ 
            lat: flag.location.coordinates[1], 
            lng: flag.location.coordinates[0] 
            }}
        >
            <div className="relative flex flex-col items-center group cursor-pointer hover:z-50">
            <div className="bg-white px-2 py-1 rounded-full shadow-md text-[10px] font-bold text-gray-800 border border-gray-100 mb-1">
                {flag.title}
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-red-500 shadow-lg overflow-hidden bg-white">
                <Avatar 
                url={flag.authorPic} 
                size="md" 
                fallbackText={flag.authorName || 'U'} 
                className="w-full h-full"
                />
            </div>
            </div>
        </AdvancedMarker>
        ))}

        {/* B. Render My "Active" Flag (The local blue 'YOU' marker) */}
        {myFlag && (
        <AdvancedMarker 
            position={{ lat: CAMPUS_BUILDINGS[selectedPlace].lat, lng: CAMPUS_BUILDINGS[selectedPlace].lng }}
        >
            <div className="relative flex flex-col items-center group cursor-pointer hover:z-50">
            <div className="bg-white px-3 py-1 rounded-full shadow-md text-[11px] font-extrabold text-gray-800 border border-gray-100 mb-1 whitespace-nowrap">
                {myFlag.status}
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white relative z-10">
                <Avatar url={user.profilePic} size="lg" fallbackText={user.handle} className="w-full h-full" />
            </div>
            <div className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full -mt-2 relative z-20 font-bold tracking-wide shadow-sm">
                YOU
            </div>
            </div>
        </AdvancedMarker>
        )}
    </Map>
    </div>

      {/* 3. Floating Action Button (FAB) */}
      {!isPlanting && (
        <div className="absolute bottom-8 right-6 z-20">
            {!myFlag &&  (
                <button 
                    onClick={() => setIsPlanting(true)}
                    className="bg-red-600 hover:bg-red-700 text-white p-5 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-105 transition-all"
                >
                    <Plus size={32} />
                </button>
            )  
            }
        </div>
         
      )}
    
      {/*profile button*/}
      <div className="absolute top-8 right-6 z-20">
            <button onClick={() => router.push('/profile')}>
                <Avatar url={user.profilePic || '/noimage.png/' } size="lg" fallbackText={user.handle} className="shadow-md border-2 border-white" />
            </button>
        </div>


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
                                <label>Where are you?</label>
                                <select value={selectedPlace} onChange={(e) => setSelectedPlace(Number(e.target.value))}>
                                    {CAMPUS_BUILDINGS.map((loc, i) => <option key={i} value={i}>{loc.name}</option>)}
                                </select>
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
                                <textarea 
                                placeholder="Provide a contact method."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm min-h-[10px]"
                                value={socmed}
                                onChange={(e) => setSocmed(e.target.value)}
                                maxLength={80}
                                />
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

    </div>
  );
};

// --- WRAPPER ---

export default function App() {
  return (
    // This is the key you provided for Google Maps (starting with AIza...m2Q)
    <APIProvider apiKey="AIzaSyDAGWOcRdniYbT7aVnV0WPvQMj53mk8m2Q">
      <Dashboard/>
    </APIProvider>
  );
}
