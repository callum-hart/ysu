import React, { useEffect } from "react";

import { sequence, update, pause, useSequence } from "../lib";

// sequence --
async function* suspendSequence() {
  while (true) {
    yield update("RUNNING");
    await pause(1000);
  }
}

// component --
const Suspend = ({ status, start, suspend, devTools }) => (
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

// hoc --
const SuspendHoc = (props) => {
  const [{ status }, start, { devTools, suspend }] = props.suspendHoc;

  useEffect(() => {
    start();
  }, []);

  return (
    <Suspend
      status={status}
      start={start}
      suspend={suspend}
      devTools={devTools}
    />
  );
};

// hook --
const SuspendHook = () => {
  const [{ status }, start, { devTools, suspend }] = useSequence(
    "suspendHook",
    suspendSequence
  );

  useEffect(() => {
    start();
  }, []);

  return (
    <Suspend
      status={status}
      start={start}
      suspend={suspend}
      devTools={devTools}
    />
  );
};

export default {
  Hoc: sequence({ suspendHoc: suspendSequence })(SuspendHoc),
  Hook: SuspendHook,
};
