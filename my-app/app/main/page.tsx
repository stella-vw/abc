import CampusMap from './mapview';

const MapView = () => (
    <div style={{ width: '100vw', height: '100vh' }}>
        <APIProvider apiKey={""} 
        onLoad={() => console.log('Maps API has loaded.')}>
            <Map
                defaultZoom={17}
                defaultCenter={ { lat: 45.505074, lng: -73.577220 } }
                onCameraChanged={ (ev: MapCameraChangedEvent) =>
                    console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                }>
            </Map>
        </APIProvider>
    </div>
);

export default MapView;
