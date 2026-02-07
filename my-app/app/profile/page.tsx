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

  // 1. Load data from the database when the component mounts
  useEffect(() => {
    const username = localStorage.getItem("loggedUser");
    if (username) {
      fetch(`/api/profile/get?username=${username}`)
        .then((res) => res.json())
        .then((data) => {
          // If the user has a profile in the DB, update our state
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
      const base64String = reader.result as string;
      setProfile(prev => ({ ...prev, profilePic: base64String }));
    };
    reader.readAsDataURL(file);
  }
};

  // 2. This function handles the database save
  const handleSave = async () => {
    const username = localStorage.getItem("loggedUser");
    
    // ADD THIS LINE:
    alert("Checking username: " + username);

    if (!username) {
      console.log("No username found. Please log in again.");
      return;
  }

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username, // Required to find the right user in MongoDB
          ...profile // Sends name, major, year, aboutMe
        }),
      });

      if (response.ok) {
        setIsEditing(false); // Only switch back to view mode if save worked
      } else {
        alert("Failed to save changes to database.");
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', width: '100%', marginTop: '20px', marginBottom: '20px' }}>
      <img 
        src={profile.profilePic} 
        style={{ borderRadius: '50%', width: '150px', height: '150px', objectFit: 'cover' }} 
      />
      
      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <input name="name" value={profile.name} onChange={handleChange} />
          <input name="major" value={profile.major} onChange={handleChange} />
          <input name="year" value={profile.year} onChange={handleChange} />
          <textarea name="aboutMe" value={profile.aboutMe} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <h1>{profile.name}</h1>
          <p>{profile.major} - {profile.year}</p>
          <p>{profile.aboutMe}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      )}

      <Link href="/main">
        <button style={{ 
          padding: '12px 24px', 
          fontSize: '16px', 
          cursor: 'pointer',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}>Return to Map</button>
      </Link>
    </div>
  );
}