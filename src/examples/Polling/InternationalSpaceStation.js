import React, { useEffect } from "react";
import { sequence } from "../../lib";

import { issLocationSequence } from "./sequence";

// TODO: add image from here https://unsplash.com/s/photos/international-space-station
export const InternationalSpaceStation = (props) => {
  const [{ status, payload }, getLocation, { history, suspend }] = props.issLocation;

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
      {/* TODO: add slider that controls time between polls */}

      {history}
    </>
  );
};

export default sequence({
  issLocation: issLocationSequence,
})(InternationalSpaceStation);
