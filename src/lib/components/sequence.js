import React, { Component } from "react";

import { History } from "./History/History";
import { logUpdate, logSuspended, logError } from "../utils/logger";
import { update } from "../utils/helpers";

function sequence(mapSequenceToProps, ...middleware) {
  return function (WrappedComponent) {
    return class extends Component {
      constructor(props) {
        super(props);

        this.history = {};

        this.state = Object.keys(mapSequenceToProps).reduce(
          (acc, sequenceId) => {
            const initialStatus = update("@IDLE");

            this.history[sequenceId] = [
              {
                val: initialStatus,
                timestamp: new Date().toLocaleTimeString(),
              },
            ];

            return {
              ...acc,
              [sequenceId]: [
                initialStatus,
                async (...args) => {
                  let isSuspended = false;
                  let error = null;

                  function suspend() {
                    isSuspended = true;

                    logSuspended(sequenceId); // if dev
                  }

                  const goodies = ({ isRunning }) => ({
                    suspend,
                    history: (
                      <History
                        sequenceId={sequenceId}
                        history={this.history[sequenceId]}
                        isRunning={isRunning}
                        isSuspended={isSuspended}
                        error={error}
                        suspend={suspend}
                        timeTravel={(stage) => {
                          this.setState({
                            [sequenceId]: [
                              stage,
                              this.state[sequenceId][1], // initiator
                              this.state[sequenceId][2], // goodies
                            ],
                          });
                        }}
                      />
                    ),
                  });

                  for await (const val of mapSequenceToProps[sequenceId](
                    ...args
                  )) {
                    if (this._isMounted && !isSuspended) {
                      const timestamp = new Date().toLocaleTimeString();

                      if (typeof val.status === "undefined") {
                        const errorMessage = `Sequence yielded a value without a \`status\` field\n\n Received: ${val}\n\n Expected: \n\n {\n   status: String, \n   payload?: Any \n }`;

                        error = {
                          message: errorMessage,
                          timestamp,
                        };

                        logError(sequenceId, errorMessage, timestamp); // if dev
                        break;
                      }

                      this.history[sequenceId].push({ val, timestamp }); // if dev

                      this.setState(
                        {
                          [sequenceId]: [
                            val,
                            this.state[sequenceId][1], // points to itself (initiator)
                            goodies({ isRunning: true }),
                          ],
                        },
                        () => {
                          logUpdate(sequenceId, val, timestamp); // if dev

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

                  // notify history sequence has finished running (if dev)
                  this.setState({
                    [sequenceId]: [
                      this.state[sequenceId][0], // value
                      this.state[sequenceId][1], // initiator
                      goodies({ isRunning: false }),
                    ],
                  });
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

export { sequence };
