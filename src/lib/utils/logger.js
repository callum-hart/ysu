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

function logError(id, val, timestamp) {
  console.group(`${id} %c@ ${timestamp}`, "color: red;");
  console.log(" error: ", "Sequence yielded a value without a `status` field");
  console.log(" received: ", val);
  console.groupEnd();
}

export { logUpdate, logSuspended, logError };