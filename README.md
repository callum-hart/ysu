# Revolve

## Goals:

- use generators to feed components a stream of updates
- always be ready to render / don't block rendering
- keep async state outside of components
- should be easy to test

## Design Principles:

- use status enums
- decorator approach popularised by Redux
- pair approach popularised by hooks

## Examples:

polling:

```js
function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

async function* randomQuote() {
  yield stage("LOADING");

  for (let i = 0; i < 5; i++) {
    try {
      if (i > 0) {
        await sleep(2000);
        yield stage("POLLING", { attempt: i });
      }

      const res = await fetch(
        "https://programming-quotes-api.herokuapp.com/quotes/random"
      );

      const data = await res.json();

      return yield stage("READY", data);
    } catch (error) {}
  }

  yield stage("FAILED", "Request timed out");
}

export const MyComponent = (props) => {
  const [quote, getQuote, Debugger] = props.quoteSequence;

  useEffect(() => {
    getQuote();
  }, [getQuote]);

  return (
    <>
      {quote.status === "LOADING" && <p>Loading...</p>}
      {quote.status === "POLLING" && (
        <p>
          Still Loading...{" "}
          {quote.payload.attempt > 2 && (
            <span>Sorry this is taking a while</span>
          )}
        </p>
      )}
      {quote.status === "READY" && (
        <>
          <p>{quote.payload.en}</p>
          <button onClick={getQuote}>Get another quote</button>
        </>
      )}
      {quote.status === "FAILED" && <p>{quote.payload}</p>}
      <button onClick={props.unmountMe}>Unmount component</button>

      {Debugger}
    </>
  );
};

export default sequence({
  quoteSequence: randomQuote,
})(MyComponent);
```