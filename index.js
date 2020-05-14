import React, { Component, useState, useEffect } from "react";

function pause(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

// stage creator: helper for conciseness and to enforce shape of yielded object
function update(status, payload) {
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

function logSuspended(id) {
  console.group(id);
  console.log(" suspended");
  console.groupEnd();
}

function logError(id, val, timestamp) {
  console.group(`${id} %c@ ${timestamp}`, "color: red;");
  console.log(" error: ", "Sequence yielded a value without a `status` field");
  console.log(" received: ", val);
  console.groupEnd();
}

function renderPayload(payload) {
  if (payload && payload instanceof Error) {
    return <pre className="error">{payload.message}</pre>;
  }

  if (payload && typeof payload === "function") {
    return <pre className="function">{payload.toString()}</pre>;
  }

  return (
    <pre className={typeof payload}>{JSON.stringify(payload, null, 2)}</pre>
  );
}

function History({ title, history, timeTravel }) {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    setActiveIndex(history.length - 1);
  }, [history.length]);

  return (
    <section
      style={{
        border: "2px solid",
        resize: "both",
        overflow: "auto",
      }}
    >
      <strong>{title}</strong>
      <ul>
        {history.map(({ val, timestamp }, index) => (
          <li
            key={index}
            style={{
              background: activeIndex === index ? "grey" : "transparent",
            }}
          >
            {val.status} @ {timestamp}
            {renderPayload(val.payload)}
            <button
              onClick={() => {
                setActiveIndex(index);
                timeTravel(val);
              }}
            >
              Jump
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function sequence(mapSequenceToProps, ...middleware) {
  return function (WrappedComponent) {
    return class extends Component {
      constructor(props) {
        super(props);

        this.history = [];

        this.state = Object.keys(mapSequenceToProps).reduce(
          (acc, sequenceId) => {
            return {
              ...acc,
              [sequenceId]: [
                update("@IDLE"),
                async (...args) => {
                  let isSuspended = false;

                  function suspend() {
                    isSuspended = true;

                    logSuspended(sequenceId); // if dev
                    // TODO: would be nice if Debugger logged suspended sequence
                  }

                  for await (const val of mapSequenceToProps[sequenceId](
                    ...args
                  )) {
                    if (this._isMounted && !isSuspended) {
                      const timestamp = new Date().toLocaleTimeString();

                      if (typeof val.status === "undefined") {
                        logError(sequenceId, val, timestamp); // if dev
                        break;
                      }

                      this.history.push({ val, timestamp }); // if dev

                      this.setState(
                        {
                          [sequenceId]: [
                            val,
                            this.state[sequenceId][1], // points to itself
                            {
                              suspend,
                              history: (
                                <History
                                  title={sequenceId}
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
                                />
                              ),
                            },
                          ],
                        },
                        () => {
                          logStage(sequenceId, val, timestamp); // if dev

                          middleware.forEach((fn) =>
                            fn.call(this, {
                              ...val,
                              meta: { sequenceId },
                            })
                          );
                        }
                      );
                    } else {
                      break;
                    }
                  }
                },
                {
                  suspend: () => null,
                  history: null,
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

export { sequence, update, pause };
