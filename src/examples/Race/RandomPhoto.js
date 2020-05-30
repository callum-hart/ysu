import React, { useEffect } from "react";
import { sequence } from "../../lib";

import { randomPhotoSequence } from "./sequence";

export const RandomPhoto = (props) => {
  const [{ status, payload }, getPhoto, { history }] = props.randomPhoto;

  useEffect(() => {
    getPhoto();
  }, [getPhoto]);

  return (
    <>
      {status === "LOADING" && <p>Loading...</p>}
      {status === "READY" && (
        <>
          <img src={payload.imageUrl} alt="" />
          <button onClick={getPhoto}>Get another photo</button>
        </>
      )}
      {status === "TIMED_OUT" && (
        <>
          <p>
            It looks like you are on a slow network. Please connect to wifi and
            try again.
          </p>
          <button onClick={getPhoto}>Try again</button>
        </>
      )}
      {status === "FAILED" && <p>{payload.message}</p>}

      {props.showYsuHistory && <>{history}</>}
    </>
  );
};

export default sequence({
  randomPhoto: randomPhotoSequence,
})(RandomPhoto);
