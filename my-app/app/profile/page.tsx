"use client"; // This line is REQUIRED in Next.js for interactive pages

import React, { useState, ChangeEvent } from 'react';

interface ProfileData {
  name: string;
  major: string;
  year: string;
  aboutMe: string;
  profilePic: string;
  stats: {
    posts: number;
    followers: number;
  };
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: "Alex Chen",
    major: "Computer Science",
    year: "Junior",
    aboutMe: "Passionate about full-stack dev and AI.",
    profilePic: "https://via.placeholder.com/150",
    stats: { posts: 12, followers: 450 }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setProfile(prev => ({ ...prev, profilePic: imageUrl }));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
      <img 
        src={profile.profilePic} 
        style={{ borderRadius: '50%', width: '150px', height: '150px', objectFit: 'cover' }} 
      />
      
      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <input name="name" value={profile.name} onChange={handleChange} />
          <input name="major" value={profile.major} onChange={handleChange} />
          <button onClick={() => setIsEditing(false)}>Save</button>
        </div>
      ) : (
        <div>
          <h1>{profile.name}</h1>
          <p>{profile.major} - {profile.year}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}