import React, { useEffect, useState } from "react";
import { sequence } from "../../lib";

import { issLocationSequence } from "./sequence";

// TODO: add image from here https://unsplash.com/s/photos/international-space-station
// https://unsplash.com/photos/PQHOmT-vkgA
export const InternationalSpaceStation = (props) => {
  const [
    { status, payload },
    getLocation,
    { history, suspend },
  ] = props.issLocation;
  const [frequency, setFrequency] = useState(5000);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return (
    <>
      {status === "LOADING" && <p>Loading...</p>}
      {status === "RECEIVED" && (
        <ul>
          <li>Timestamp: {payload.timestamp}</li>
          <li>Latitude: {payload.lat}</li>
          <li>Long: {payload.long}</li>
        </ul>
      )}
      {status === "FAILED" && <p>{payload.message}</p>}
      <button onClick={suspend}>Stop</button>
      <br />
      <label htmlFor="frequency">
        Poll frequency ({frequency} milliseconds)
      </label>
      <input
        id="frequency"
        type="range"
        min="1000"
        max="5000"
        step="1000"
        value={frequency}
        onChange={(event) => {
          suspend();
          setFrequency(event.target.value);
          getLocation(event.target.value);
        }}
      ></input>

      {props.showYsuHistory && <>{history}</>}
    </>
  );
};

export default sequence({
  issLocation: issLocationSequence,
})(InternationalSpaceStation);
