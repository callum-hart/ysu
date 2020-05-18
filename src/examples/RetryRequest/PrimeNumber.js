import React, { useEffect } from "react";
import { sequence } from "../../lib";

import { primeNumberSequence } from "./sequence";

// TODO: add image from here https://unsplash.com/photos/djb1whucfBY
export const PrimeNumber = (props) => {
  const [{ status, payload }, getNumber, { history }] = props.primeNumber;

  useEffect(() => {
    getNumber();
  }, [getNumber]);

  return (
    <>
      {status === "LOADING" && <p>Loading...</p>}
      {status === "RETRYING" && <p>Retrying... {payload.attempt} / 5</p>}
      {status === "FOUND" && (
        <>
          <p>{payload.number} is a prime number!</p>
        </>
      )}
      {(status === "FAILED" || status === "RETRIES_EXCEEDED") && (
        <p>{payload.message}</p>
      )}

      {history}
    </>
  );
};

export default sequence({
  primeNumber: primeNumberSequence,
})(PrimeNumber);
