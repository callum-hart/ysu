import React, { useEffect } from "react";

import { sequence } from "../lib";

// sequence --
function* usabilitySequence() {}

// component --
export const Usability = (props) => {
  const [{ status }, start, { devTools }] = props.usability;

  useEffect(() => {
    start();
  }, [start]);

  return (
    <>
      <p data-qa="result">{status}</p>
      {devTools}
    </>
  );
};

export default sequence({
  usability: usabilitySequence,
})(Usability);
