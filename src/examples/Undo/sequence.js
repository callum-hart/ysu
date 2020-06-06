import { update, pause } from "../../lib";

import { deleteAccount } from "./service";

async function* deleteAccountSequence(command, payload) {
  if (command === "DELETE") {
    yield update("SOFT_DELETING");

    // pause for 3 seconds before deleting
    await pause(3000);

    // inform UI that delete cannot be undone now
    yield update("DELETING");

    // if sequence is suspended within 3 seconds we never reach here
    try {
      await deleteAccount(payload);

      yield update("DELETED");
    } catch (error) {
      yield update("FAILED", error);
    }
  }

  if (command === "UNDO") {
    yield update("UNDONE");
  }
}

export { deleteAccountSequence };
