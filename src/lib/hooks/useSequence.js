import React, { useState, useEffect, useRef } from "react";

import { History } from "../components/History/History";
import { logUpdate, logSuspended, logError } from "../utils/logger";
import { update, payloadToString } from "../utils/helpers";

function useSequence(sequenceId, generator) {
  const initialStatus = update("@IDLE");
  const history = useRef([
    {
      val: initialStatus,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [value, setValue] = useState(initialStatus);
  const [goodies, setGoodies] = useState({
    suspend,
    devTools: null,
  });

  useEffect(() => {
    return () => suspend();
  }, []);

  let isSuspended = false;
  let error = null;

  function suspend() {
    isSuspended = true;

    logSuspended(sequenceId); // if dev
  }

  async function initiator(...args) {
    for await (const val of generator(...args)) {
      if (!isSuspended) {
        const timestamp = new Date().toLocaleTimeString();

        if (typeof val.status === "undefined") {
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

        history.current.push({ val, timestamp }); // if dev

        setValue(val);
        setGoodies({
          suspend,
          devTools: (
            <History
              sequenceId={sequenceId}
              history={history.current}
              isRunning={true}
              isSuspended={isSuspended}
              error={error}
              suspend={suspend}
              timeTravel={(stage) => {
                setValue(stage);
              }}
            />
          ),
        });
        logUpdate(sequenceId, val, timestamp); // if dev
      } else {
        break;
      }
    }

    // notify history sequence has finished running (if dev)
    setGoodies({
      suspend,
      devTools: (
        <History
          sequenceId={sequenceId}
          history={history.current}
          isRunning={false}
          isSuspended={isSuspended}
          error={error}
          suspend={suspend}
          timeTravel={(stage) => {
            setValue(stage);
          }}
        />
      ),
    });
  }

  return [value, initiator, goodies];
}

export { useSequence };
