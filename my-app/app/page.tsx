import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Home Page</h1>
      <p>Click the button below to view your profile.</p>
      
      <Link href="/profile">
        <button style={{ 
          padding: '12px 24px', 
          fontSize: '16px', 
          cursor: 'pointer',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}>
          Go to My Profile
        </button>
      </Link>

      <h1>Login Page</h1>
      <p>Click the button below to login.</p>
      
      <Link href="/login">
        <button style={{ 
          padding: '12px 24px', 
          fontSize: '16px', 
          cursor: 'pointer',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}>
          Go to Login
        </button>
      </Link>
    
      
    </div>

  );
}