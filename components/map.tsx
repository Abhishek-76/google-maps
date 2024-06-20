import { useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";
import Homes from "./home";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export default function Map() {
  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 12.954, lng: 77.631 }),
    []
  );
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "afb7bbc90fcf6765",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  const [office, setOffice] = useState<LatLngLiteral>(); //<here we define what it going to use >
  const [home, setHome] = useState<LatLngLiteral>();
  return (
    <div className="container">
      <div className="controls">
        <h1>Directions</h1>
        <h4>From</h4>
        <Homes
          setHome={(homeposition) => {
            setHome(homeposition);
            mapRef.current?.panTo(homeposition); //to panto the location
          }}
        />
        <h4>To</h4>
        <Places
          setOffice={(position) => {
            setOffice(position);
            mapRef.current?.panTo(position); //to panto the location
          }}
        />
      </div>
      <div className="map">
        <GoogleMap
          zoom={12}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {office && (
            <>
              <Marker position={office} />
              <Circle center={office} radius={10000} options={closeOptions} />
              <Circle center={office} radius={15000} options={middleOptions} />
              <Circle center={office} radius={20000} options={farOptions} />
            </>
          )}

          {home && (
            <>
              <Marker position={home} />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};

// const generateHouses = (position: LatLngLiteral) => {
//   const _houses: Array<LatLngLiteral> = [];
//   for (let i = 0; i < 100; i++) {
//     const direction = Math.random() < 0.5 ? -2 : 2;
//     _houses.push({
//       lat: position.lat + Math.random() / direction,
//       lng: position.lng + Math.random() / direction,
//     });
//   }
//   return _houses;
// };
