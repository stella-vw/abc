"use client"; // Required for hooks

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to your dashboard/main page
    router.replace('/main'); 
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <p className="text-gray-400 animate-pulse">Redirecting to OnMyWay!...</p>
    </div>
  );
}