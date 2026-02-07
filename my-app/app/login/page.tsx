"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/register'; // determine if user is logging in or registering

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("loggedUser", username);
        // Optional: Show a success message if they just registered
        if (!isLogin) {
          alert("Account created! Now logging you in...");
        }
        router.push('/profile');
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '10px' }}>
          {isLogin ? 'Welcome Back' : 'Join Us'}
        </h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          {isLogin ? 'Login with your username' : 'Create a new account'}
        </p>

        {error && (
          <div style={{ color: 'white', backgroundColor: '#ff4d4f', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
            style={inputStyle}
            disabled={loading}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            style={inputStyle}
            disabled={loading}
          />
          
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }} 
            style={toggleButtonStyle}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
}

// --- STYLES ---

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f5f5f5'
};

const cardStyle: React.CSSProperties = {
  padding: '40px',
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px',
  textAlign: 'center'
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const inputStyle = {
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '16px'
};

const buttonStyle = {
  padding: '12px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background 0.2s'
};

const toggleButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#0070f3',
  textDecoration: 'underline',
  cursor: 'pointer',
  marginLeft: '5px',
  fontWeight: '500'
};