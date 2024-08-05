import { useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  Circle,
  Polyline,
  TrafficLayer,
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";
import Homes from "./home";
import RouteTable from "./routeTable";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type DirectionsRoute = google.maps.DirectionsRoute;
type MapOptions = google.maps.MapOptions;

export default function Map() {
  const mapRef = useRef<GoogleMap>();
  const [office, setOffice] = useState<LatLngLiteral>();
  const [home, setHome] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult | null>(null);
  const [allRoutes, setAllRoutes] = useState<DirectionsRoute[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(
    null
  );
  const [showTraffic, setShowTraffic] = useState<boolean>(false);

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

  const fetchDirections = (home: LatLngLiteral) => {
    if (!office) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: home,
        destination: office,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status === "OK" && result) {
          console.log("Directions Result:", result);
          setDirections(result);
          setAllRoutes((prevRoutes) => [...prevRoutes, ...result.routes]);
          setSelectedRouteIndex(null);
        } else {
          console.error("Directions request failed due to ", status);
        }
      }
    );
  };

  const handleRouteClick = (index: number) => {
    setSelectedRouteIndex(index);
    setShowTraffic(true); // Show traffic for the selected route
  };

  return (
    <div className="container">
      <div className="content">
        <div className="controls">
          <h1>Directions</h1>
          <h4>{!office && <p>Enter the address of your Home</p>}</h4>
          <Homes
            setHome={(position) => {
              setHome(position);
              mapRef.current?.panTo(position);
            }}
          />

          <h4>{!office && <p>Enter the address of your Office</p>}</h4>
          <Places
            setOffice={(position) => {
              setOffice(position);
              mapRef.current?.panTo(position);
            }}
          />
          {selectedRouteIndex !== null &&
            directions &&
            directions.routes &&
            directions.routes[selectedRouteIndex] && (
              <Distance leg={directions.routes[selectedRouteIndex].legs[0]} />
            )}
        </div>

        <div className="map">
          <GoogleMap
            zoom={12}
            center={center}
            mapContainerClassName="map-container"
            options={options}
            onLoad={onLoad}
          >
            {allRoutes.map((route, index) => (
              <Polyline
                key={index}
                path={route.overview_path}
                options={{
                  strokeColor:
                    index === selectedRouteIndex ? "#1976D2" : "#808080",
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                }}
                onClick={() => handleRouteClick(index)}
              />
            ))}
            {office && (
              <>
                <Marker
                  position={office}
                  icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
                />
                <Circle center={office} radius={10000} options={closeOptions} />
                <Circle
                  center={office}
                  radius={15000}
                  options={middleOptions}
                />
                <Circle center={office} radius={20000} options={farOptions} />
              </>
            )}

            {home && (
              <>
                <Marker
                  position={home}
                  onClick={() => {
                    fetchDirections(home);
                  }}
                />
              </>
            )}
            {showTraffic && <TrafficLayer />}
          </GoogleMap>
        </div>
      </div>
      <div className="table-container">
        <div className="table-wrapper">
          {allRoutes.length > 0 ? (
            <RouteTable
              routes={allRoutes}
              selectedRoutes={
                selectedRouteIndex !== null ? [selectedRouteIndex] : []
              }
              onRouteSelect={handleRouteClick}
            />
          ) : (
            <p>
              No routes available. Please enter your home and office addresses
              to see the routes.
            </p>
          )}
        </div>
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
