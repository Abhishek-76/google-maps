import { useLoadScript } from "@react-google-maps/api";
import Map from "../components/map";

const APIKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function Home() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: APIKEY,
    libraries: ["places"],
  });

  if (loadError) return <div>Error loading the Google Maps API</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return <Map />;
}
