import React, { useEffect, useState } from "react";
import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  StructuredListSkeleton,
  ButtonSkeleton,
  Button,
  Slider,
  InlineNotification,
} from "carbon-components-react";

import { sequence } from "../../lib";
import { issLocationSequence } from "./sequence";

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
      <h1>ISS Position</h1>
      {status === "LOADING" && (
        <>
          <StructuredListSkeleton rowCount={1} />
          <ButtonSkeleton />
        </>
      )}
      {status === "RECEIVED" && (
        <>
          <StructuredListWrapper>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>Latitude</StructuredListCell>
                <StructuredListCell head>Longitude</StructuredListCell>
                <StructuredListCell head>Timestamp</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              <StructuredListRow>
                <StructuredListCell noWrap>{payload.lat}</StructuredListCell>
                <StructuredListCell>{payload.long}</StructuredListCell>
                <StructuredListCell>{payload.timestamp}</StructuredListCell>
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>
          <Button onClick={suspend}>Stop</Button>
        </>
      )}
      {status === "FAILED" && (
        <>
          <InlineNotification
            hideCloseButton={true}
            kind="error"
            title={payload.message}
          />
          <Button
            onClick={() => {
              suspend();
              getLocation();
            }}
          >
            Try again
          </Button>
        </>
      )}
      <Slider
        hideTextInput={true}
        id="poll-frequency"
        labelText={`Poll frequency (${frequency / 1000} seconds)`}
        max={5000}
        min={1000}
        onChange={({ value }) => {
          suspend();
          setFrequency(value);
          getLocation(value);
        }}
        step={1000}
        value={frequency}
      />

      {props.showYsuHistory && <>{history}</>}
    </>
  );
};

export default sequence({
  issLocation: issLocationSequence,
})(InternationalSpaceStation);
