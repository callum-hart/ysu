import { pause } from "../../lib";

async function placeStockBid(payload) {
  await pause(2000); // simulate network request latency

  return new Promise((resolve, reject) => {
    resolve();
    // reject(new Error("Error placing bid"));
  });
}

export { placeStockBid };