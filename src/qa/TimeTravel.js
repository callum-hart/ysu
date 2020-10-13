import React, { useEffect } from "react";

import { sequence, update } from "../lib";

// sequence --
function* timeTravelSequence() {
  yield update("FIRST");
  yield update("MIDDLE");
  yield update("LAST");
}

// component --
const TimeTravel = (props) => {
  const [{ status }, start, { devTools }] = props.timeTravel;

  useEffect(() => {
    start();
  }, []);

  return (
    <>
      <p data-qa="result">{status}</p>
      {devTools}
    </>
  );
};

export default sequence({
  timeTravel: timeTravelSequence,
})(TimeTravel);
