"use client";
import {APIProvider, Map, MapCameraChangedEvent} from '@vis.gl/react-google-maps';

const MapView = () => (
    <div style={{ width: '100vw', height: '100vh' }}>
        <APIProvider apiKey={"AIzaSyDAGWOcRdniYbT7aVnV0WPvQMj53mk8m2Q"} 
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