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
    try {
      const number = await getRandomNumber();

      if (i > 1) {
        await pause(3000);
        yield update("RETRYING", { attempt: i, number });
      }

      if (isPrimeNumber(number)) {
        return yield update("FOUND", { number });
      }
    } catch (error) {
      return yield update("FAILED", error);
    }
  }

  yield update("RETRIES_EXCEEDED", new Error("Couldn't find prime number"));
}

export { primeNumberSequence };
