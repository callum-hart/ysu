import { update, pause } from "../../lib";

import { getIssLocation } from "./service";

async function* issLocationSequence(delay = 2000) {
  yield update("LOADING");

  while (true) {
    try {
      const location = await getIssLocation();

      yield update("RECEIVED", location);
    } catch (error) {
      // return stops the generator (exits the loop)
      return yield update("FAILED", error);
    }

    // wait N seconds before calling endpoint again
    await pause(delay);
  }
}

export { issLocationSequence };