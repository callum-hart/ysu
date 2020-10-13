function logUpdate(id, { status, payload }, timestamp) {
  console.group(`${id} %c@ ${timestamp}`, "color: #7f8188;");
  console.log(`status: %c${status}`, "font-weight: bold;");

  if (payload) {
    console.log("payload: ", payload);
  }

  console.groupEnd();
}

function logSuspended(id) {
  console.group(id);
  console.log("🛑 Sequence suspended");
  console.groupEnd();
}

function logError(id, errorMessage, timestamp) {
  console.group(`${id} %c@ ${timestamp}`, "color: #7f8188;");
  console.log(`%c${errorMessage}`, "color: #eb6a6c;");
  console.groupEnd();
}

export { logUpdate, logSuspended, logError };
