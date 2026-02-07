"use client";
import React from "react";
import { APIProvider } from "@vis.gl/react-google-maps";

export default function MapProvider({ children }: { children: React.ReactNode }) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string} 
    onLoad={() => console.log('Maps API has loaded.')}>
      {children}
    </APIProvider>
  );
}