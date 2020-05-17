import { update } from "../../lib";

import { getRandomQuote } from "./service";

async function* randomQuoteSequence() {
  yield update("LOADING");

  try {
    const quote = await getRandomQuote();

    yield update("READY", quote);
  } catch (error) {
    yield update("FAILED", error);
  }
}

export { randomQuoteSequence };
