import React, { useState } from "react";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import axios from "axios";
import { Text } from "@mantine/core";

const GeoAPI = (props) => {
  console.log(process.env.REACT_APP_GEO_APIKEY);
  const [lon, setLon] = useState("");
  const [lat, setLat] = useState("");
  // const [county, setCounty] = useState("");
  const [formatted, setFormatted] = useState("");
  function onPlaceSelect(value) {
    console.log(value);
    console.log(value.properties, "properties");
    if (value) {
      setLon(value.properties.lon);
      setLat(value.properties.lat);
      props.setCounty(value.properties.county);
      setFormatted(value.properties.formatted);
      // getPlaceName(lon, lat);
    }
  }

  function onSuggectionChange(value) {
    console.log(value);
  }

  const getPlaceName = (lon, lat) => {
    // axios
    //   .get(
    //     // `https://api.geoapify.com/v2/places?categories=building&filter=circle:${lon},${lat},500&bias=proximity:-0.07071648508463113,51.50848194136378&limit=20&apiKey=apikey`
    //     `https://api.geoapify.com/v2/places?categories=building.residential&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=20&apiKey=${process.env.GEO_APIKEY}`
    //   )
    //   .then((res) => console.log(res, "res from lat lon"));
    axios
      .get(
        `https://api.geoapify.com/v2/places?categories=building.residential&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=20&apiKey=a1e4990d346a407f86d6128b66d52348`
      )
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };
  // image.pn
  // categories: building , postal_code , accommodation
  return (
    <GeoapifyContext apiKey="a1e4990d346a407f86d6128b66d52348">
      <GeoapifyGeocoderAutocomplete
        placeholder="Enter postalcode here"
        type={"postcode"}
        lang="en"
        countryCodes={"sg"}
        // position={position}
        // countryCodes={countryCodes}
        limit={10}
        // value={displayValue}
        placeSelect={onPlaceSelect}
        suggestionsChange={onSuggectionChange}
      />
      <Text>{formatted && formatted}</Text>
    </GeoapifyContext>
  );
};

export default GeoAPI;
