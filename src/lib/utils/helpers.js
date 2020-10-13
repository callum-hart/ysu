function pause(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

// stage creator: helper for conciseness and to enforce shape of yielded object
function update(status, payload) {
  return { status, payload };
}

function payloadToString(payload) {
  if (payload instanceof Error) {
    return {
      type: "error",
      string: payload.message,
    };
  }

  if (typeof payload === "function") {
    return {
      type: "function",
      string: payload.toString(),
    };
  }

  return {
    type: typeof payload,
    string: JSON.stringify(payload, null, 2),
  };
}

export { pause, update, payloadToString };