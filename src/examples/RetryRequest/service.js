async function getRandomNumber() {
  const res = await fetch(
    "https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain"
  );
  const text = await res.text();

  return parseInt(text);
}

export { getRandomNumber };
