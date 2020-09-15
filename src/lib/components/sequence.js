import React, { Component } from "react";

import { History } from "./History/History";
import { logUpdate, logSuspended, logError } from "../utils/logger";
import { update, payloadToString } from "../utils/helpers";

// TODO: rename to withSequence, and rename mapSequenceToProps to generatorMap
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
                    devTools: (
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
                    if (!isSuspended) {
                      const timestamp = new Date().toLocaleTimeString();

                      if (typeof val.status === "undefined") {
                        // TODO: move this out so it can be reused by the hook
                        const errorMessage = `Sequence did not yield a status enum\n\nReceived:\n\n${
                          payloadToString(val).string
                        }\n\nExpected:\n\n${
                          payloadToString({
                            status: "String",
                            "payload?": "Any",
                          }).string
                        }`;

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
                  devTools: null,
                },
              ],
            };
          },
          {}
        );
      }

      componentWillUnmount() {
        for (const sequenceId of Object.keys(mapSequenceToProps)) {
          this.state[sequenceId][2].suspend();
        }
      }

      render() {
        return <WrappedComponent {...this.props} {...this.state} />;
      }
    };
  };
}

export { sequence };
