import React, { useEffect } from "react";

async function* randomQuote() {
  yield { status: "LOADING" };

  try {
    const res = await fetch(
      "https://programming-quotes-api.herokuapp.com/quotes/random"
    );
    const data = await res.json();

    yield { status: "READY", payload: data };
  } catch (error) {
    yield { status: "FAILED", payload: error };
  }
}

function logStage(id, { status, payload }) {
  console.group(`${id} %c@ ${new Date().toLocaleTimeString()}`, "color: grey;");
  console.log(` status: %c${status}`, "color: green;");

  if (payload) {
    console.log(" payload: ", payload);
  }

  console.groupEnd();
}

function logError(id, val) {
  console.group(`${id} %c@ ${new Date().toLocaleTimeString()}`, "color: red;");
  console.log(
    " error: ",
    "Sequence yielded an object without a `status` field"
  );
  console.log(" received: ", val);
  console.groupEnd();
}

function sequence(mapSequenceToProps) {
  return function (WrappedComponent) {
    return class extends React.Component {
      constructor(props) {
        super(props);

        this.state = Object.keys(mapSequenceToProps).reduce(
          (acc, sequenceId) => {
            return {
              ...acc,
              [sequenceId]: [
                { status: "@IDLE" },
                async (...args) => {
                  // TODO: if multiple components call the same generator within a given timeframe can the result be served from cache?

                  for await (const val of mapSequenceToProps[sequenceId](
                    ...args
                  )) {
                    if (this._isMounted) {
                      if (typeof val.status === "undefined") {
                        logError(sequenceId, val); // if dev
                        break;
                      }

                      logStage(sequenceId, val); // if dev

                      this.setState({
                        [sequenceId]: [
                          val,
                          this.state[sequenceId][1], // points to itself
                        ],
                      });
                    } else {
                      break;
                    }
                  }
                },
              ],
            };
          },
          {}
        );
      }

      componentDidMount() {
        // Antipattern but adequate for poc.
        this._isMounted = true;
      }

      componentWillUnmount() {
        this._isMounted = false;
      }

      render() {
        return <WrappedComponent {...this.props} {...this.state} />;
      }
    };
  };
}

export const MyComponent = (props) => {
  const [quote, getQuote] = props.quoteSequence;

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
    </>
  );
};

export default sequence({
  quoteSequence: randomQuote,
})(MyComponent);
