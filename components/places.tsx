import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

type PlacesProps = {
  setOffice: (position: google.maps.LatLngLiteral) => void;
};

export default function Places({ setOffice }: PlacesProps) {
  const {
    ready,
    value, //given by user
    setValue, //to changed value
    suggestions: { status, data }, // status of the suggestion ok or not and acctual data of those suggestions themselves
    clearSuggestions, //after selecting one suggestion to clear other suggestions
  } = usePlacesAutocomplete();

  const handleSelect = async (val: string) => {
    //handleSelect handle the option or address we choose and pin it on map
    setValue(val, false);
    clearSuggestions();

    const results = await getGeocode({ address: val }); //to extract the latitude and longitude of the results, it will give a bunch of results
    const { lat, lng } = await getLatLng(results[0]);
  };
  return (
    <Combobox>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input"
        placeholder="Search an Address"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
}
