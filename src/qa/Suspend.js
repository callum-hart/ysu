import React, { useEffect } from "react";

import { sequence, update, pause } from "../lib";

// sequence --
async function* suspendSequence() {
  while (true) {
    yield update("RUNNING");
    await pause(1000);
  }
}

// component --
const Suspend = (props) => {
  const [{ status }, start, { devTools, suspend }] = props.suspend;

  useEffect(() => {
    start();
  }, []);

  return (
    <>
      <p data-qa="result">{status}</p>
      <button type="button" onClick={start} data-qa="start-button">
        Start
      </button>
      <button type="button" onClick={suspend} data-qa="suspend-button">
        Suspend
      </button>
      {devTools}
    </>
  );
};

export default sequence({
  suspend: suspendSequence,
})(Suspend);
