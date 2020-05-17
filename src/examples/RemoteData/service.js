async function getRandomQuote() {
  const res = await fetch(
    "https://programming-quotes-api.herokuapp.com/quotes/random"
  );

  return res.json();
}

export { getRandomQuote };
