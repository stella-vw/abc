"use client";
import React from "react";
import { APIProvider } from "@vis.gl/react-google-maps";

export default function MapProvider({ children }: { children: React.ReactNode }) {
  return (
    <APIProvider apiKey={'AIzaSyDAGWOcRdniYbT7aVnV0WPvQMj53mk8m2Q'}
    onLoad={() => console.log('Maps API has loaded.')}>
      {children}
    </APIProvider>
  );
}