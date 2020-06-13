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

The component is connected to the generator using the `sequence` higher-order component. When(ever) the generator yields an `update` the component (re)renders.

Each field passed to `sequence` is mapped to a prop which contains a pair. The prop `randomQuote` holds the pair: quote and getQuote. `quote` reflects the current status of the sequence along with any data associated with that status. `getQuote` is a function that initiates the sequence.

The `randomQuote` sequence starts when the component mounts, or when the user clicks the *Get another quote* button.

This is a fairly straightforward example, however other examples with live demos are linked below.

## Examples

- [Remote Data Fetching]() Similar to the basic example above.
- [Polling]() Endpoint is polled every N seconds, where the user can change the frequency of, or pause and resume polling.
- [Retry Request]() Retries an XHR request until a certain condition is met, or number of retries exceeds 5 attempts.
- [Aggregation]() Render data from multiple endpoints only when all datasets are ready.
- [Race]() Time constraign a request to 2 seconds so that the UI isn't blocked on slow internet connections.
- [User Journey]() Form in which the user has 5 seconds to either confirm or cancel submission.
- [Undo]() After submitting a form the user can change their mind by clicking undo.

## Features

- Debugger with time travel 🚀
- Baked in logger
- Middleware support

## Design Decisions

*High Level*

Much of what makes UI programming difficult is managing values that change over time. If we take the sterotypical async example of making an API request, the UI reflects a sequence of state changes.

The state starts off **idle** → then goes to \***loading** → then finishes with \*\***success** or **failed**.

\* *usually triggered on component mount / form submission*

\*\* *depending on the API response*

Our API request has three sequential stages with four possible statuses.

Async generators (`async function*`) are very good at coordinating sequences since they can be paused, exited and resumed.

This means we can do something asynchronous → yield an update to the UI → re-enter to resume where we left off → do something else → yield another update to the UI → and so forth.

The API request can be represented using a sequence diagram:

| Time  | Component                 | Generator |
| ----- | ------------------------- | --------- |
| ↓     | initiate sequence ------> |           |
| ↓     |                      | <------ yield "loading" |
| ↓     | loading...           | call API |
| ↓     | ✅success            | <------ yield "success" on resolve |
| ↓     | ❌error              | <------ yield "failed" on reject |

You may have noticed this sequence diagram depicts exactly what is happening in the basic example shown earlier.

Since yielding from a generator triggers a (re)render in the UI – and generators can generate values forever – implementing infinite and finite sequences such as polling or retries is trivial.

Polling is as simple as calling an endpoint from an [infinite loop](), whilst retrying an XHR request N times can be achieved with a [`for` loop]().

By using generators we can leverage language features to keep async state out of components, offer predictable rendering (1 yield equals 1 (re)render), whilst maintaining a simple mental model (components just recieve props).

---

*Low Level*

- Keep asynchronous state out of components
- Don't block rendering ([always be ready to render](https://overreacted.io/writing-resilient-components/#principle-2-always-be-ready-to-render))
- Use [status enums](https://kentcdodds.com/blog/stop-using-isloading-booleans)
- Same API for function and class components
- Component state over global state
- Decorator approach popularised by Redux
- Pair approach popularised by hooks

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

Helper function that pauses a sequence for a given amount of time.
