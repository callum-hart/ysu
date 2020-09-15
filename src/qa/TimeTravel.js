import React, { useEffect } from "react";

import { sequence, update, useSequence } from "../lib";

// sequence --
function* timeTravelSequence() {
  yield update("FIRST");
  yield update("MIDDLE");
  yield update("LAST");
}

// component --
const TimeTravel = ({ status, devTools }) => (
  <>
    <p data-qa="result">{status}</p>
    {devTools}
  </>
);

// hoc --
const TimeTravelHoc = (props) => {
  const [{ status }, start, { devTools }] = props.timeTravelHoc;

  useEffect(() => {
    start();
  }, []);

  return <TimeTravel status={status} devTools={devTools} />;
};

// hook --
const TimeTravelHook = () => {
  const [{ status }, start, { devTools }] = useSequence(
    "timeTravelHook",
    timeTravelSequence
  );

  useEffect(() => {
    start();
  }, []);

  return <TimeTravel status={status} devTools={devTools} />;
};

export default {
  Hoc: sequence({ timeTravelHoc: timeTravelSequence })(TimeTravelHoc),
  Hook: TimeTravelHook,
};
