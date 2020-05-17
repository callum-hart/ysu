function pause(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

// stage creator: helper for conciseness and to enforce shape of yielded object
function update(status, payload) {
  return { status, payload };
}

export { pause, update };