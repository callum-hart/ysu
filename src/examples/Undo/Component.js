import React from "react";

import { sequence } from "../../lib";
import { undoSequence } from "./sequence";

export const UndoComponent = (props) => {
  const [{ status, payload }, transition, { history, suspend }] = props.undo;

  return (
    <>
      {(status === "@IDLE" || status === "UNDONE" || status === "FAILED") && (
        <>
          <p>Account</p>
          <button onClick={() => transition("DELETE", { accountId: "123" })}>
            Delete
          </button>
        </>
      )}

      {status === "SOFT_DELETE" && (
        <>
          <p>Deleting account</p>
          <button
            onClick={() => {
              suspend(); // suspend scheduled delete
              transition("UNDO");
            }}
          >
            Undo
          </button>
        </>
      )}

      {status === "DELETING" && <p>Deleting account</p>}
      {status === "DELETED" && <p>Account deleted</p>}
      {status === "FAILED" && <p>{payload.message}</p>}

      {props.showYsuHistory && <>{history}</>}
    </>
  );
};

export default sequence({
  undo: undoSequence,
})(UndoComponent);
