export function pinDevTools(sequenceId) {
  localStorage.setItem(
    `ysuPosition-${sequenceId}`,
    JSON.stringify({ x: 400, y: 0 })
  );
}
