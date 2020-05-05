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

network request:

```js
async function* randomQuote() {
  yield stage("LOADING");

  try {
    const res = await fetch(
      "https://programming-quotes-api.herokuapp.com/quotes/random"
    );

    const data = await res.json();

    yield stage("READY", data);
  } catch (error) {
    yield stage("FAILED", error);
  }
}

export const MyComponent = (props) => {
  const [quote, getQuote, Debugger] = props.quoteSequence;

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
      <button onClick={props.unmountMe}>Unmount component</button>

      {Debugger}
    </>
  );
};

export default sequence({
  quoteSequence: randomQuote
})(MyComponent);
```

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

user journey:

```js
async function paymentService(payload) {
  await sleep(2000); // simulate network request latency

  console.log(payload);

  return new Promise((resolve, reject) => {
    resolve();
    // reject(new Error("Something went wrong."));
  });
}

async function* payment(command, payload) {
  if (command === "CONFIRM") {
    yield stage("CONFIRM");
  } else if (command === "SUBMIT") {
    yield stage("SUBMITTING");

    try {
      await paymentService(payload);
      yield stage("SUCCESS");
    } catch (error) {
      yield stage("FAILED", error);
    }
  } else {
    yield stage("CAPTURE");
  }
}

export const MyComponent = (props) => {
  const [payment, transition, Debugger] = props.paymentSequence;
  const [amount, setAmount] = useState("");
  const [card, setCard] = useState("debit");
  const renderForm = () => (
    <>
      {payment.status === "FAILED" && <p>{payment.payload.message}</p>}
      <label htmlFor="amount">Amount: </label>
      <input
        id="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <label htmlFor="card">Choose card: </label>
      <select id="card" value={card} onChange={(e) => setCard(e.target.value)}>
        <option value="debit">Debit card</option>
        <option value="credit">Credit card</option>
      </select>
      <button onClick={() => transition("CONFIRM")}>Next</button>
    </>
  );
  const renderConfirm = () => (
    <>
      Check amount: {amount}
      <button onClick={() => transition("CAPTURE")}>Back</button>
      <button
        type="submit"
        onClick={() => transition("SUBMIT", { amount, card })}
        disabled={payment.status === "SUBMITTING"}
      >
        Submit
      </button>
    </>
  );

  useEffect(() => {
    transition();
  }, [transition]);

  return (
    <form>
      {(payment.status === "CAPTURE" || payment.status === "FAILED") && (
        <>{renderForm()}</>
      )}
      {(payment.status === "CONFIRM" || payment.status === "SUBMITTING") && (
        <>{renderConfirm()}</>
      )}
      {payment.status === "SUCCESS" && <p>Payment was successful</p>}

      {Debugger}
    </form>
  );
};

export default sequence({
  paymentSequence: payment,
})(MyComponent);
```