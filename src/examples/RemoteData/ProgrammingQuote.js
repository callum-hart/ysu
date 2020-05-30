import React, { useEffect } from "react";
import { sequence } from "../../lib";

import { programmingQuoteSequence } from "./sequence";

// TODO: add image from here https://unsplash.com/photos/qjnAnF0jIGk
export const ProgrammingQuote = (props) => {
  const [{ status, payload }, getQuote, { history }] = props.programmingQuote;

  useEffect(() => {
    getQuote();
  }, [getQuote]);

  return (
    <>
      {status === "LOADING" && <p>Loading...</p>}
      {status === "READY" && (
        <>
          <p>{payload.en}</p>
          <button onClick={getQuote}>Get another quote</button>
        </>
      )}
      {status === "FAILED" && <p>{payload.message}</p>}

      {props.showYsuHistory && <>{history}</>}
    </>
  );
};

export default sequence({
  programmingQuote: programmingQuoteSequence,
})(ProgrammingQuote);
