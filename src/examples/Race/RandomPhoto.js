import React, { useEffect } from "react";
import {
  SkeletonPlaceholder,
  ButtonSkeleton,
  Button,
  InlineNotification,
} from "carbon-components-react";

import { sequence } from "../../lib";
import { randomPhotoSequence } from "./sequence";

export const RandomPhoto = (props) => {
  const [{ status, payload }, getPhoto, { history }] = props.randomPhoto;

  useEffect(() => {
    getPhoto();
  }, [getPhoto]);

  return (
    <>
      <h1>Random Photo</h1>
      {status === "LOADING" && (
        <>
          <SkeletonPlaceholder
            style={{
              height: "300px",
              width: "300px",
            }}
          />
          <ButtonSkeleton />
        </>
      )}
      {status === "READY" && (
        <>
          <div>
            <img src={payload.imageUrl} alt="" />
          </div>
          <Button onClick={getPhoto}>Get another photo</Button>
        </>
      )}
      {status === "TIMED_OUT" && (
        <>
          <InlineNotification
            hideCloseButton={true}
            kind="info"
            title="It appears you're on a slow internet connection."
            subtitle="Please connect to a faster network and try again."
          />
          <Button onClick={getPhoto}>Try again</Button>
        </>
      )}
      {status === "FAILED" && (
        <>
          <InlineNotification
            hideCloseButton={true}
            kind="error"
            title={payload.message}
          />
          <Button onClick={getPhoto}>Try again</Button>
        </>
      )}

      {props.showYsuHistory && <>{history}</>}
    </>
  );
};

export default sequence({
  randomPhoto: randomPhotoSequence,
})(RandomPhoto);
