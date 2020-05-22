import React, { Component } from "react";

import { History } from "./History/History";
import { logUpdate, logSuspended, logError } from "../utils/logger";
import { update } from "../utils/helpers";

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
                    // TODO: would be nice if History logged suspended sequence
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
