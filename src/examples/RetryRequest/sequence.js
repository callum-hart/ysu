import { update, pause } from "../../lib";

import { getRandomNumber } from "./service";

function isPrimeNumber(number) {
  for (let i = 2; i < number; i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return number > 1;
}

async function* primeNumberSequence() {
  yield update("LOADING");

  for (let i = 1; i <= 5; i++) {
    // wait 3 seconds after the first request
    if (i > 1) {
      await pause(3000);
    }

    try {
      const number = await getRandomNumber();

      if (isPrimeNumber(number)) {
        // return stops the generator (exits the loop)
        return yield update("FOUND", { attempt: i, number });
      }

      yield update("NOT_FOUND", { attempt: i, number });
    } catch (error) {
      // return stops the generator (exits the loop)
      return yield update("FAILED", error);
    }
  }

  yield update("RETRIES_EXCEEDED", new Error("Couldn't find prime number"));
}

export { primeNumberSequence };
