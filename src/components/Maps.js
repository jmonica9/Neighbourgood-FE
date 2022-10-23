import React from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { useState, useRef } from "react";
import { Box, Button, Input } from "@mantine/core";
const containerStyle = {
  width: "400px",
  height: "400px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

function Maps() {
  const [directionsReponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.GOOGLE_APIKEY,
    libraries: ["places"],
  });
  const [map, setMap] = React.useState(/**@type google.maps.GoogleMap */ null);

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef("");
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef("");

  const calculateRoute = async () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  };

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <div>
      {/* <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
    
    </GoogleMap> */}
      <div>
        <Autocomplete>
          <Input type="text" placeholder="Origin" ref={originRef} />
        </Autocomplete>
        <Box flexGrow={1}>
          <Autocomplete>
            <Input type="text" placeholder="Destination" ref={destinationRef} />
          </Autocomplete>
        </Box>

        <Button color="pink" type="submit" onClick={calculateRoute}>
          Calculate Route
        </Button>
        {distance && distance}
      </div>
    </div>
  );
}

export default React.memo(Maps);
