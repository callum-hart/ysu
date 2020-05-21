import { update } from "../../lib";

import { getNextSpaceXLaunch, getNextNasaLaunch } from "./service";

async function* nextLaunchSequence() {
  yield update("LOADING");

  try {
    const [spaceX, nasa] = await Promise.all([
      getNextSpaceXLaunch(),
      getNextNasaLaunch(),
    ]);

    yield update("READY", { spaceX, nasa });
  } catch (error) {
    yield update("FAILED", error);
  }
}

export { nextLaunchSequence };
