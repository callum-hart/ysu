import React, { useEffect } from "react";
import { sequence } from "../../lib";

import { randomQuoteSequence } from "./sequence";

export const RandomQuote = (props) => {
  const [quote, getQuote, { history }] = props.randomQuote;

  useEffect(() => {
    getQuote();
  }, [getQuote]);

  return (
    <>
      {quote.status === "LOADING" && <p>Loading...</p>}
      {quote.status === "READY" && (
        <>
          <p>{quote.payload.en}</p>
          <button onClick={getQuote}>Get another quote</button>
        </>
      )}
      {quote.status === "FAILED" && <p>{quote.payload.message}</p>}

      {history}
    </>
  );
};

export default sequence({
  randomQuote: randomQuoteSequence,
})(RandomQuote);
