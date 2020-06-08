# YSU
*Stream updates to React components from ES6 generators*

## Introduction

YSU is an experimental library to manage asynchronous state in React.

It stands for yield sequential updates, which describes the process of **streaming updates to components from generators.**

## Basic Example

```js
import { update, sequence } from "ysu";

// sequence --
async function* randomQuoteSequence() {
  yield update("LOADING");

  try {
    const res = await fetch("https://programming-quotes-api.herokuapp.com/quotes/random");
    const data = await res.json();

    yield update("READY", data);
  } catch (error) {
    yield update("FAILED", error);
  }
}

// component --
const RandomQuote = props => {
  const [quote, getQuote] = props.randomQuote;

  useEffect(() =>
    getQuote();
  }, [getQuote]);

  return (
    <>
      {quote.status === "LOADING" && <p>Loading...</p>}
      {quote.status === "READY" && <p>{quote.payload.en}</p>}
      {quote.status === "FAILED" && <p>{quote.payload.message}</p>}
      <button onClick={getQuote}>Get another quote</button>
    </>
  );
};

export default sequence({
  randomQuote: randomQuoteSequence
})(RandomQuote);
```

In this example the component is connected to the generator using the `sequence` higher-order component. When(ever) the generator yields an `update` the component (re)renders.

Each key–value passed to `sequence` is mapped to a prop which contains a pair. Here the prop `randomQuote` holds the pair [quote, getQuote]. `quote` reflects the current status of the sequence, and any information associated with the status, whilst `getQuote` is a function that initiates the sequence.

The `randomQuote` sequence starts when the component mounts (`useEffect`) and when the user clicks the *Get another quote* button.

This is a fairly trivial example, however other examples with live demos are linked below.

## Examples

- [Remote Data Fetching]() Similar to the basic example above.
- [Polling]() Endpoint is polled every N seconds, where the user can change the frequency of, or pause and resume polling.
- [Retry Request]() Retries an XHR request until a certain condition is met, or number of retries exceeds 5 attempts.
- [Aggregation]() Render data from multiple endpoints only when all datasets are ready.
- [Race]() Time constraign a request to 2 seconds so that the UI isn't blocked on slow internet connections.
- [User Journey]() Form in which the user has 5 seconds to either confirm or cancel submission.
- [Undo]() After submitting a form the user can change their mind by clicking undo.

## API

### `sequence`

Higher-order component that connects a component to one or more generators.

### `update`

Pure function that returns an object with the shape:

```js
{
  status, // required, string
  payload // optional, any
}
```

### `pause`

Helper function used to pause a sequence for a given amount of time.
