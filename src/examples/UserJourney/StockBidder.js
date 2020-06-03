import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    transition();
  }, [transition]);

  return (
    <form>
      {(status === "CAPTURE" || status === "FAILED") && (
        <>
          {status === "FAILED" && <p>{payload.message}</p>}
          <label htmlFor="price">Price: </label>
          <input
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <label htmlFor="units">Units: </label>
          <input
            id="units"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
          />
          <button
            disabled={!price || !units}
            onClick={() => transition("CONFIRM")}
          >
            Next
          </button>
        </>
      )}
      {(status === "CONFIRM" || status === "SUBMITTING") && (
        <>
          <p>
            Price: {price} Units: {units}
          </p>
          {status === "CONFIRM" && (
            <p>{payload.timeToBid} seconds left to bid</p>
          )}
          <button
            onClick={() => {
              suspend(); // cancels bidding window
              transition("CAPTURE");
            }}
          >
            Back
          </button>
          <button
            type="submit"
            disabled={status === "SUBMITTING"}
            onClick={() => {
              suspend(); // cancels bidding window
              transition("SUBMIT", { price, units });
            }}
          >
            Confirm
          </button>
        </>
      )}
      {status === "SUCCESS" && (
        <>
          <p>Bid was successful</p>
          <button
            onClick={() => {
              setPrice("");
              setUnits("");
              transition();
            }}
          >
            Place another bid
          </button>
        </>
      )}

      {props.showYsuHistory && <>{history}</>}
    </form>
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
