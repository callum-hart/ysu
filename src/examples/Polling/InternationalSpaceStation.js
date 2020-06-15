import React, { useEffect, useState } from "react";
import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  StructuredListSkeleton,
  Button,
  Form,
  FormGroup,
  RadioButtonGroup,
  RadioButton,
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
  const [frequency, setFrequency] = useState(2000);
  const [control, setControl] = useState("start");

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  if (status === "FAILED") {
    return (
      <>
        <h1>ISS Location</h1>
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
    );
  }

  return (
    <>
      <h1>ISS Location</h1>
      {status === "LOADING" && <StructuredListSkeleton rowCount={1} />}

      {status === "RECEIVED" && (
        <StructuredListWrapper>
          <StructuredListHead>
            <StructuredListRow>
              <StructuredListCell head>Latitude</StructuredListCell>
              <StructuredListCell head>Longitude</StructuredListCell>
              <StructuredListCell head>Timestamp</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            <StructuredListRow>
              <StructuredListCell>{payload.lat}</StructuredListCell>
              <StructuredListCell>{payload.long}</StructuredListCell>
              <StructuredListCell>{payload.timestamp}</StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
      )}

      <Form action="#">
        <FormGroup legendText="Polling">
          <RadioButtonGroup
            defaultSelected={control}
            valueSelected={control}
            name="poll-status"
            onChange={(value) => {
              suspend();

              if (value === "start") {
                getLocation(frequency);
              }

              setControl(value);
            }}
          >
            <RadioButton
              id="start-polling"
              labelText="Start"
              value="start"
            />
            <RadioButton
              id="stop-polling"
              labelText="Stop"
              value="stop"
            />
          </RadioButtonGroup>
        </FormGroup>
        <FormGroup>
          <Slider
            hideTextInput={true}
            id="poll-frequency"
            labelText={`Poll frequency (${frequency} milliseconds)`}
            max={5000}
            min={1000}
            onChange={({ value }) => {
              suspend();
              setFrequency(value);
              setControl("start");
              getLocation(value);
            }}
            step={1000}
            value={frequency}
          />
        </FormGroup>
      </Form>

      {props.showYsuHistory && <>{history}</>}
    </>
  );
};

export default sequence({
  issLocation: issLocationSequence,
})(InternationalSpaceStation);
