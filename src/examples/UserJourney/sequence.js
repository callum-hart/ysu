import { update, pause } from "../../lib";

import { placeStockBid } from "./service";

async function* stockBidSequence(command, payload) {
  if (command === "CONFIRM") {
    // give user 5 seconds to confirm bid
    for (let i = 0; i < 5; i++) {
      yield update("CONFIRM", { timeToBid: 5 - i });
      await pause(1000);
    }

    // if 5 seconds have passed bidding window has ended and we never reach here
    yield update("FAILED", new Error("5 second bidding window ended"));
  } else if (command === "SUBMIT") {
    yield update("SUBMITTING");

    try {
      await placeStockBid(payload);
      yield update("SUCCESS");
    } catch (error) {
      yield update("FAILED", error);
    }
  } else {
    yield update("CAPTURE");
  }
}

export { stockBidSequence };
