import { update } from "../../lib";

import { getProgrammingQuote } from "./service";

async function* programmingQuoteSequence() {
  yield update("LOADING");

  try {
    const quote = await getProgrammingQuote();

    yield update("READY", quote);
  } catch (error) {
    yield update("FAILED", error);
  }
}

export { programmingQuoteSequence };
