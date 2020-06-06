import { update, pause } from "../../lib";

import { getIssLocation } from "./service";

async function* issLocationSequence(delay = 2000) {
  yield update("LOADING");

  while (true) {
    try {
      const location = await getIssLocation();

      yield update("RECEIVED", location);
    } catch (error) {
      return yield update("FAILED", error);
    }

    await pause(delay);
  }
}

export { issLocationSequence };