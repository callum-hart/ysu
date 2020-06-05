import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  TextInput,
  InlineNotification,
  InlineLoading,
  Tile,
} from "carbon-components-react";

import { sequence } from "../../lib";
import { stockBidSequence } from "./sequence";

export const StockBidder = (props) => {
  const [
    { status, payload },
    transition,
    { history, suspend },
  ] = props.stockBid;
  const [price, setPrice] = useState("");
  const [units, setUnits] = useState("");
  const renderForm = () => (
    <>
      {status === "FAILED" && (
        <InlineNotification
          hideCloseButton={true}
          kind="error"
          title={payload.message}
        />
      )}
      <FormGroup>
        <TextInput
          id="price"
          labelText="Bid price (£)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <TextInput
          id="units"
          labelText="No. of shares"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
        />
      </FormGroup>
      <Button disabled={!price || !units} onClick={() => transition("CONFIRM")}>
        Next
      </Button>
    </>
  );
  const renderConfirm = () => (
    <>
      {status === "CONFIRM" && <p>{payload.timeToBid} seconds left to bid</p>}
      {status === "SUBMITTING" && (
        <InlineLoading description="Submitting bid" />
      )}
      <Tile>
        <p>
          <strong>Bid price</strong> £{price}
        </p>
        <p>
          <strong>No. of shares</strong> {units}
        </p>
        <p>
          <strong>Total</strong> £{price * units}
        </p>
      </Tile>
      <div className="bx--btn-set">
        <Button
          kind="secondary"
          onClick={() => {
            suspend(); // cancels bidding window
            transition("CAPTURE");
          }}
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={status === "SUBMITTING"}
          onClick={() => {
            suspend(); // cancels bidding window
            transition("SUBMIT", { price, units });
          }}
        >
          Confirm
        </Button>
      </div>
    </>
  );
  const renderSuccess = () => (
    <>
      <InlineNotification
        hideCloseButton={true}
        kind="success"
        title="Bid was successful"
      />
      <Button
        onClick={() => {
          setPrice("");
          setUnits("");
          transition();
        }}
      >
        Place another bid
      </Button>
    </>
  );

  useEffect(() => {
    transition();
  }, [transition]);

  return (
    <>
      <h1>Stock Bidder</h1>
      <Form action="#" autoComplete="off">
        {(status === "CAPTURE" || status === "FAILED") && <>{renderForm()}</>}
        {(status === "CONFIRM" || status === "SUBMITTING") && (
          <>{renderConfirm()}</>
        )}
        {status === "SUCCESS" && <>{renderSuccess()}</>}

        {props.showYsuHistory && <>{history}</>}
      </Form>
    </>
  );
};

function trackingMiddleware({ status, payload, meta }) {
  if (status === "SUCCESS") {
    console.log("Track successful bid", payload, meta);
  }
}

function errorMiddleware({ status, payload, meta }) {
  if (status === "FAILED") {
    console.log("Log failed bid", payload.message, meta);
  }
}

export default sequence(
  {
    stockBid: stockBidSequence,
  },
  trackingMiddleware,
  errorMiddleware
)(StockBidder);
