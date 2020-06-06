import { pause } from "../../lib";

async function deleteAccount(payload) {
  console.log("deleteAccount: ", payload);
  await pause(1000); // simulate network request latency

  return new Promise((resolve, reject) => {
    resolve();
    // reject(new Error("Error deleting account"));
  });
}

export { deleteAccount };
