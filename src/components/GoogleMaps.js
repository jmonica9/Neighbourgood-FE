import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
// import scriptLoader from "react-async-script-loader";
export function GoogleMaps() {
  const [address, setAddress] = React.useState("");
  const [coordinates, setCoordinates] = React.useState({
    lat: null,
    lng: null,
  });

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };

  return (
    <div>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
        // searchOptions={{ types: ["(cities)"], componentRestrictions: { country: ["us", "ca"] } }}"
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <p>Latitude: {coordinates.lat}</p>
            <p>Longitude: {coordinates.lng}</p>

            <input {...getInputProps({ placeholder: "Type address" })} />

            <div>
              {loading ? <div>...loading</div> : null}

              {suggestions.map((suggestion) => {
                const style = {
                  backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                };

                return (
                  <div {...getSuggestionItemProps(suggestion, { style })}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
}

// import React from "react";
// import PlacesAutocomplete from "react-places-autocomplete";

// function GoogleMaps({ isScriptLoaded, isScriptLoadSucceed }) {
//   const [address, setAddress] = React.useState("");

//   const handleChange = (value) => {
//     setAddress(value);
//   };

//   const handleSelect = (value) => {
//     setAddress(value);
//   };

//   if (isScriptLoaded && isScriptLoadSucceed) {
//     return (
//       <div>
//         <PlacesAutocomplete
//           value={address}
//           onChange={handleChange}
//           onSelect={handleSelect}
//         >
//           {({
//             getInputProps,
//             suggestions,
//             getSuggestionItemProps,
//             loading,
//           }) => (
//             <div>
//               <input
//                 {...getInputProps({
//                   placeholder: "Enter Address...",
//                 })}
//               />
//               <div>
//                 {loading && <div>Loading...</div>}
//                 {suggestions.map((suggestion) => {
//                   const style = suggestion.active
//                     ? { backgroundColor: "#a83232", cursor: "pointer" }
//                     : { backgroundColor: "#ffffff", cursor: "pointer" };

//                   return (
//                     <div {...getSuggestionItemProps(suggestion, { style })}>
//                       {suggestion.description}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </PlacesAutocomplete>
//       </div>
//     );
//   } else {
//     return <div></div>;
//   }
// }
// run 2 APIs

// export default scriptLoader([
//   `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_APIKEY}&libraries=places`,
// ])(GoogleMaps);
