/**
 * Copyright 2024 Google LLC
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    https://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

import React, {useState, useEffect} from 'react';
import { createRoot } from "react-dom/client";
import { APIProvider, ControlPosition, Map, MapCameraChangedEvent, Pin, AdvancedMarker } from '@vis.gl/react-google-maps';

import MapHandler from './map-handler';
import { CustomMapControl } from './map-control';

const initialPosition = { lat: 40.0173051, lng: -105.2843275 };
const API_KEY = process.env.GOOGLE_MAPS_API_KEY

type Poi ={ key: string, location: google.maps.LatLngLiteral }

const App = () => {
    const [poiList, setPoiList] = useState<Poi[]>([]);
    const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
    console.log('address:',selectedPlace?.formatted_address);
    console.log('address geometry:',
        selectedPlace?.geometry?.location.lat(),
        selectedPlace?.geometry?.location.lng());

    useEffect(() => { // add new marker when a place is selected
        if (selectedPlace) {
            const newPoi: Poi = {
                key: selectedPlace.formatted_address,
                location: {
                    lat: selectedPlace.geometry.location.lat(),
                    lng: selectedPlace.geometry.location.lng()
                }
            };
            setPoiList(prevList => [...prevList, newPoi]);
        }
    }, [selectedPlace]);

    return (
    <APIProvider apiKey={API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
            mapId="map"
            defaultZoom={13}
            defaultCenter={ initialPosition }
            gestureHandling={'greedy'}
            onCameraChanged={ (ev: MapCameraChangedEvent) =>
                console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
            } >
            <PoiMarkers pois={poiList} />
        </Map>
        <CustomMapControl
            controlPosition={ControlPosition.TOP}
            onPlaceSelect={setSelectedPlace}
        />

        <MapHandler place={selectedPlace} />
    </APIProvider>
    );
};

const PoiMarkers = (props: {pois: Poi[]}) => {
    return (
      <>
        {props.pois.map( (poi: Poi) => (
          <AdvancedMarker
            key={poi.key}
            position={poi.location}>
          <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>
        ))}
      </>
    );
  };

const root = createRoot(document.getElementById('app'));
root.render(<App />);

export default App;