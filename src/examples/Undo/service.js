import { pause } from "../../lib";

async function doSomething(payload) {
  console.log('doSomething: ', payload);
  await pause(1000); // simulate network request latency

  return new Promise((resolve, reject) => {
    // resolve();
    reject(new Error("Error deleting account"));
  });
}

export { doSomething };
