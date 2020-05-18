async function getProgrammingQuote() {
  const res = await fetch(
    "https://programming-quotes-api.herokuapp.com/quotes/random"
  );

  return res.json();
}

export { getProgrammingQuote };
