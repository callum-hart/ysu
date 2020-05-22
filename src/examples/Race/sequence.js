import { update, pause } from "../../lib";

import { getRandomPhoto } from "./service";

async function* randomPhotoSequence() {
  yield update("LOADING");

  try {
    // only wait for the response within 2 seconds
    const photo = await Promise.race([getRandomPhoto(), pause(2000)]);

    if (photo) {
      yield update("READY", photo);
    } else {
      yield update("TIMED_OUT");
    }
  } catch (error) {
    yield update("FAILED", error);
  }
}

export { randomPhotoSequence };
