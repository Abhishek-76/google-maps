import { useLoadScript } from "@react-google-maps/api";
import Map from "../components/map";

export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAFBm55zxPkUMSE906m-ZsRYXrSJWO2lik",
    libraries: ["places"],
  });

  if (!isLoaded) return <div> Loading...</div>;

  return <Map />;
}
