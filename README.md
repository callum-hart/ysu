# YSU
*Stream updates to React components from ES6 generators*

## Introduction

YSU is an experimental\* library to manage asynchronous state in React. It stands for yield sequential updates, which describes the process of **streaming updates to components from generators.**

<sup>*minimal test coverage and not yet used in production, please use with caution.</sup>

<img src="https://raw.githubusercontent.com/callum-hart/ysu/master/assets/undo-demo.gif" alt="GIF demonstrating undo after submitting a form" width="100%" />

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

  useEffect(() => {
    getQuote();
  }, []);

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

The component is connected to the generator using the `sequence` higher-order component. **When(ever) the generator yields an `update` the component (re)renders.**

Each field passed to `sequence` is mapped to a prop which contains a pair. In this example the prop `randomQuote` holds the pair:

- `[quote, ` reflects the current status of the sequence, along with any data associated with that status.
- `getQuote]` a function that when called initiates the sequence.

The `randomQuote` sequence starts when the component mounts, or when the user clicks the *Get another quote* button. This is a fairly straightforward example, however other examples with live demos are linked below.

## Examples

The examples can be viewed [online](https://ysu.netlify.app/), or alternatively can be run locally by cloning the repository and running `npm install` and then `npm start`.

- **Remote Data Fetching** Similar to the basic example above ([demo](https://ysu.netlify.app/remote-data) | [code](https://github.com/callum-hart/ysu/tree/master/src/examples/RemoteData)).
- **Polling** Endpoint is polled every N seconds, where the user can change the frequency of, or pause and resume polling ([demo](https://ysu.netlify.app/polling) | [code](https://github.com/callum-hart/ysu/tree/master/src/examples/Polling)).
- **Retry Request** Retries an XHR request until a certain condition is met, or number of retries exceeds 5 attempts ([demo](https://ysu.netlify.app/retry-request) | [code](https://github.com/callum-hart/ysu/tree/master/src/examples/RetryRequest)).
- **Aggregation** Render data from multiple endpoints only when all datasets are ready ([demo](https://ysu.netlify.app/aggregation) | [code](https://github.com/callum-hart/ysu/tree/master/src/examples/Aggregation)).
- **Race** Time constraign a request to 2 seconds so that the UI isn't blocked on slow internet connections ([demo](https://ysu.netlify.app/race) | [code](https://github.com/callum-hart/ysu/tree/master/src/examples/Race)).
- **User Journey** Form in which the user has 5 seconds to either confirm or cancel submission ([demo](https://ysu.netlify.app/user-journey) | [code](https://github.com/callum-hart/ysu/tree/master/src/examples/UserJourney)).
- **Undo** After submitting a form the user can change their mind by clicking undo ([demo](https://ysu.netlify.app/undo) | [code](https://github.com/callum-hart/ysu/tree/master/src/examples/Undo)).
- **Debounce** Run a remote search query once the user has stopped typing for 2 seconds ([demo](https://ysu.netlify.app/debounce) | [code](https://github.com/callum-hart/ysu/tree/master/src/examples/Debounce)).
- **Composition** Compose a sequence from multiple generators ([demo](https://ysu.netlify.app/composition) | [code](https://github.com/callum-hart/ysu/tree/master/src/examples/Composition)).

## Features

**DevTools with time travel 🚀**

<img src="https://raw.githubusercontent.com/callum-hart/ysu/master/assets/dev-tools.png" alt="Screenshot of the DevTools panel" />

**Baked-in logger**

<img src="https://raw.githubusercontent.com/callum-hart/ysu/master/assets/logger.png" alt="Screenshot of the console logger" />

**Middleware support**

Subscribe to a stream of updates for third-party interactions such as logging and error reporting.

## Overview

Much of what makes UI programming difficult is managing values that change over time. If we take the sterotypical async example of making an API request, the UI reflects a sequence of state changes.

The state starts off **idle** → then goes to **loading**\* → then finishes with **success** or **failed**\*\*.

<sup>*usually triggered on component mount / user interaction. **depending on the API response.</sup>

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

Since yielding from a generator triggers a (re)render in the UI, and generators can generate values forever, implementing infinite and finite sequences such as polling or retries is trivial.

Polling is as simple as calling an endpoint and yielding an update to the UI within an [infinite loop](https://github.com/callum-hart/ysu/blob/master/src/examples/Polling/sequence.js#L8). Whilst retrying an XHR request does the same but from within a [finite loop](https://github.com/callum-hart/ysu/blob/master/src/examples/RetryRequest/sequence.js#L18).

Note: on component unmount any running sequences are stopped and scheduled updates cancelled automatically. This ensures that infinite sequences (such as polling) only run when the component is mounted.

## Goals / Design Decisions

- Keep asynchronous state out of components
- Don't block rendering ([always be ready to render](https://overreacted.io/writing-resilient-components/#principle-2-always-be-ready-to-render))
- Component state over global state
- Same API for function and class components
- Predictable rendering (1 yield equals 1 render)
- Simple mental model (components just recieve props)
- Baked-in [status enums](https://kentcdodds.com/blog/stop-using-isloading-booleans)
- Decorator approach popularised by Redux
- Pair approach popularised by hooks

## API

YSU exports the following functions:

```js
import { sequence, update, pause } from "ysu";
```

### `sequence`

Higher-order component that connects a component to one or more generators:

```js
sequence(generatorMap, middleware?)(Component);
```
#### `generatorMap`

Object that maps generator functions to component props:

```js
sequence(
  {
    foo: fooSequence,
    bar: barSequence
  }
)(Component);
```

In this example `fooSequence` will be available in the component via the prop `foo`. Each prop (such as foo and bar) is an array containing 3 items:

```js
const [value, initiator, goodies] = props.foo;
```

0. `value` Object containing:
    - `status` String: the status of the sequence (i.e: `"LOADING"`)
    - `payload?` Any: data associated with the current status (i.e: `{ userName: "@chart" }`)
1. `initiator` Function: that starts the sequence
2. `goodies` Object containing:
    - `devTools` Component: that renders the history of the sequence. Note: the history is transient and destroyed when the component unmounts.
    - `suspend` Function: that stops the sequence and cancels any scheduled updates (i.e: click button to stop polling)

#### `middleware`

One or more functions that are subscribed to the sequence. They are called whenever a generator yields an update:

```js
sequence(
  {
    foo: fooSequence,
    bar: barSequence
  },
  trackingMiddleware,
  errorMiddleware,
  // as many middlewares you desire
)(Component);

function trackingMiddleware({ status, payload, meta }) {
  if (status === "SUCCESS") {
    // track conversion
  }
}

function errorMiddleware({ status, payload, meta }) {
  if (status === "FAILED") {
    // log error
  }
}
```

Each middleware function is passed an object containing:

- `status` String: the status of the sequence
- `payload?` Any: data associated with the current status
- `meta` Object containing:
  - `sequenceId` String: corresponds to the name of the prop (i.e: `foo` or `bar`)

Note: middleware is colocated with components since sequences could have different tracking or error logging requirements depending on where they’re used.

### `update`

Pure function that describes a step in a sequence:

```js
yield update(status, payload?);
```

- `status` String: the status of the sequence
- `payload?` Any: data associated with the current status

Returns an object containing `{ status, payload? }`.

### `pause`

Helper function that pauses a sequence for a given amount of time:

```js
await pause(delay);
```

- `delay` Number: how long in milliseconds the sequence should be paused

Returns a Promise.

## Todos / Ideas

Only include devTools and logger in development bundles.

Expose back/forward functions for UIs with undo/redo:

```js
const [quote, getQuote, { goBack, goForward }] = props.quoteSequence;
```

Persist context between yields. This would be useful when composing multiple sequences:

```js
// sequence --
yield update("READY", { rates }, { persist: true });
// ...yields from other generators...

// component --
const [{ status, payload }, transition, { context }] = props.currencyConverter;

<>{context.rates}</> // rates available in context for any statuses that follow READY
```

Automatically suspend a running sequence when new sequence is initiated.

Investigate how YSU would integrate with React suspense and concurrent mode.

In-built cache and sequence deduplication.

Hooks alternative to higher-order component API:

```js
const [quote, getQuote, goodies] = useYSU(randomQuoteSequence);

// with unique key for in-built cache: `useYSU('key', randomQuoteSequence)`
```

Move devTools and logger out into separate package `@ysu/devtools`.

## Changelog

### `0.0.0-alpha` → `0.1.0-beta`

- Test coverage 🧪
- Visual cues in devTools when sequence:
  - is running 🏃🏻‍♂️
  - has been suspended ⏸
- Include errors in devTools ⚠️
- Ability to suspend sequence from devTools 🛠
- Consistent colours in logger and devTools 💅
- Only publish library code to npm 🚢
- Rename history to devTools 🤓
- Fix unmount memory leak 💦

## License

MIT