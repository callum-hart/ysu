import React, { useEffect } from "react";
import {
  SkeletonText,
  ButtonSkeleton,
  Button,
  InlineNotification,
} from "carbon-components-react";

import { sequence } from "../../lib";
import { programmingQuoteSequence } from "./sequence";

export const ProgrammingQuote = (props) => {
  const [{ status, payload }, getQuote, { history }] = props.programmingQuote;

  useEffect(() => {
    getQuote();
  }, [getQuote]);

  return (
    <>
      <h1>Programming Quote</h1>
      {status === "LOADING" && (
        <>
          <SkeletonText />
          <SkeletonText width="25%" />
          <ButtonSkeleton />
        </>
      )}
      {status === "READY" && (
        <>
          <blockquote
            cite={`https://programming-quotes-api.herokuapp.com/quotes/id/${payload.id}`}
          >
            <p>{payload.en}</p>
            <footer>— {payload.author}</footer>
          </blockquote>
          <Button onClick={getQuote}>Get another quote</Button>
        </>
      )}
      {status === "FAILED" && (
        <>
          <InlineNotification
            hideCloseButton={true}
            kind="error"
            title={payload.message}
          />
          <Button onClick={getQuote}>Try again</Button>
        </>
      )}

      {props.showYsuHistory && <>{history}</>}
    </>
  );
};

export default sequence({
  programmingQuote: programmingQuoteSequence,
})(ProgrammingQuote);
