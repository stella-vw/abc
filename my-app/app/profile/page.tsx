"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';

interface ProfileData {
  name: string;
  major: string;
  year: string;
  aboutMe: string;
  profilePic: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: "Enter name",
    major: "Enter major",
    year: "Enter year",
    aboutMe: "Tell us about yourself",
    profilePic: '/noimage.png',
  });

  useEffect(() => {
    const username = localStorage.getItem("loggedUser");
    if (username) {
      fetch(`/api/profile/get?username=${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setProfile({
              name: data.name || "Enter name",
              major: data.major || "Enter major",
              year: data.year || "Enter year",
              aboutMe: data.aboutMe || "Tell us about yourself",
              profilePic: data.profilePic || '/noimage.png',
            });
          }
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profilePic: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const username = localStorage.getItem("loggedUser");
    if (!username) return;

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, ...profile }),
      });

      if (response.ok) setIsEditing(false);
      else alert("Failed to save changes.");
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Header / Cover Background */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600" />
        
        <div className="relative px-6 pb-8">
          {/* Profile Picture */}
          <div className="relative -mt-16 mb-4 flex justify-center">
            <img 
              src={profile.profilePic} 
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md bg-white"
              alt="Profile"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-1/2 translate-x-16 bg-white p-2 rounded-full shadow-lg cursor-pointer border hover:bg-gray-50 transition">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                <span className="text-xs font-semibold text-blue-600">Edit</span>
              </label>
            )}
          </div>

          {isEditing ? (
            /* --- EDIT MODE --- */
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                <input name="name" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={profile.name} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Major</label>
                  <input name="major" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={profile.major} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Year</label>
                  <input name="year" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={profile.year} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">About Me</label>
                <textarea name="aboutMe" rows={4} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={profile.aboutMe} onChange={handleChange} />
              </div>
              <button onClick={handleSave} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                Save Changes
              </button>
            </div>
          ) : (
            /* --- VIEW MODE --- */
            <div className="text-center animate-in zoom-in-95 duration-300">
              <h1 className="text-3xl font-extrabold text-gray-900">{profile.name}</h1>
              <p className="text-blue-600 font-medium mb-4">{profile.major} • Year {profile.year}</p>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6 italic text-gray-600">
                "{profile.aboutMe}"
              </div>
              
              <button 
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-6 py-2 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 text-center">
        <Link href="/main" className="text-sm font-semibold text-gray-500 hover:text-blue-600 flex items-center justify-center gap-2">
          ← Return to Map
        </Link>
      </div>
    </div>
  );
}