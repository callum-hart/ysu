import React, { useEffect } from "react";

import { sequence, update } from "../lib";

// sequence --
function* validationSequence() {
  yield update("BEFORE ERROR");
  yield "INVALID PAYLOAD";
  yield update("AFTER ERROR");
}

// component --
export const Validation = (props) => {
  const [{ status }, start, { devTools }] = props.validation;

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
  validation: validationSequence,
})(Validation);
