import React, { useEffect } from "react";

/**
 * Library ---
 */

// stage creator: helper for conciseness and to enforce shape of yielded object
function stage(status, payload) {
  return { status, payload };
}

function logStage(id, { status, payload }, timestamp) {
  console.group(`${id} %c@ ${timestamp}`, "color: grey;");
  console.log(` status: %c${status}`, "color: green;");

  if (payload) {
    console.log(" payload: ", payload);
  }

  console.groupEnd();
}

function logError(id, val, timestamp) {
  console.group(`${id} %c@ ${timestamp}`, "color: red;");
  console.log(" error: ", "Sequence yielded a value without a `status` field");
  console.log(" received: ", val);
  console.groupEnd();
}

function Debugger(props) {
  return (
    <ul>
      {props.history.map((stage, index) => (
        <li key={index} onClick={() => props.timeTravel(stage.val)}>
          {stage.val.status} @ {stage.timestamp}
          <pre>{JSON.stringify(stage.val.payload, null, 2)}</pre>
        </li>
      ))}
    </ul>
  );
}

function sequence(mapSequenceToProps) {
  return function (WrappedComponent) {
    return class extends React.Component {
      constructor(props) {
        super(props);

        this.history = [];

        this.state = Object.keys(mapSequenceToProps).reduce(
          (acc, sequenceId) => {
            return {
              ...acc,
              [sequenceId]: [
                stage("@IDLE"),
                async (...args) => {
                  for await (const val of mapSequenceToProps[sequenceId](
                    ...args
                  )) {
                    if (this._isMounted) {
                      const timestamp = new Date().toLocaleTimeString();

                      if (typeof val.status === "undefined") {
                        logError(sequenceId, val, timestamp); // if dev
                        break;
                      }

                      logStage(sequenceId, val, timestamp); // if dev

                      this.history.push({ val, timestamp }); // if dev

                      this.setState({
                        [sequenceId]: [
                          val,
                          this.state[sequenceId][1], // points to itself
                          <Debugger
                            history={this.history}
                            timeTravel={(stage) => {
                              this.setState({
                                [sequenceId]: [
                                  stage,
                                  this.state[sequenceId][1],
                                  this.state[sequenceId][2],
                                ],
                              });
                            }}
                          />,
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

/**
 * Usage ---
 */

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
  quoteSequence: randomQuote,
})(MyComponent);
