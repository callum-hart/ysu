import React, { useEffect } from "react";
import {
  SkeletonText,
  Button,
  InlineNotification,
  InlineLoading,
} from "carbon-components-react";

import { sequence } from "../../lib";
import { primeNumberSequence } from "./sequence";

export const PrimeNumber = (props) => {
  const [{ status, payload }, getNumber, { history }] = props.primeNumber;

  useEffect(() => {
    getNumber();
  }, [getNumber]);

  return (
    <>
      <h1>Prime Number</h1>
      {status === "LOADING" && <SkeletonText width="50%" />}
      {status === "NOT_FOUND" && (
        <>
          <p>{payload.number} is NOT a prime number</p>
          <InlineLoading
            description={`Retrying. Attempt ${payload.attempt} of 5`}
          />
        </>
      )}
      {status === "FOUND" && (
        <>
          <p>{payload.number} is a prime number!</p>
          <Button onClick={getNumber}>Go again</Button>
        </>
      )}
      {(status === "FAILED" || status === "RETRIES_EXCEEDED") && (
        <>
          <InlineNotification
            hideCloseButton={true}
            kind="error"
            title={payload.message}
          />
          <Button onClick={getNumber}>Try again</Button>
        </>
      )}

      {props.showYsuHistory && <>{history}</>}
    </>
  );
};

export default sequence({
  primeNumber: primeNumberSequence,
})(PrimeNumber);
