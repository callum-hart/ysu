function logUpdate(id, { status, payload }, timestamp) {
  console.group(`${id} %c@ ${timestamp}`, "color: grey;");
  console.log(` status: %c${status}`, "color: green;");

  if (payload) {
    console.log(" payload: ", payload);
  }

  console.groupEnd();
}

function logSuspended(id) {
  console.group(id);
  console.log(" suspended");
  console.groupEnd();
}

function logError(id, errorMessage, timestamp) {
  console.group(`${id} %c@ ${timestamp}`, "color: red;");
  console.log(errorMessage);
  console.groupEnd();
}

export { logUpdate, logSuspended, logError };
