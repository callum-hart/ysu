import React, { useEffect } from "react";
import { sequence } from "../../lib";

import { issLocationSequence } from "./sequence";

// TODO: add image from here https://unsplash.com/s/photos/international-space-station
export const InternationalSpaceStation = (props) => {
  const [location, getLocation, { history, suspend }] = props.issLocation;

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return (
    <>
      {location.status === "LOADING" && <p>Loading...</p>}
      {location.status === "READY" && (
        <ul>
          <li>Timestamp: {location.payload.timestamp}</li>
          <li>Latitude: {location.payload.lat}</li>
          <li>Long: {location.payload.long}</li>
        </ul>
      )}
      {location.status === "FAILED" && <p>{location.payload.message}</p>}
      <button onClick={suspend}>Stop</button>
      {/* TODO: add slider that controls time between polls */}

      {history}
    </>
  );
};

export default sequence({
  issLocation: issLocationSequence,
})(InternationalSpaceStation);
