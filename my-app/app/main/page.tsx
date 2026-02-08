import CampusMap from './mapview';

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* This is your main hub that contains the map and sidebar */}
      <CampusMap />
    </main>
  );
}
