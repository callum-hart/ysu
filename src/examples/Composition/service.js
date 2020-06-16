import { pause } from "../../lib";

async function getExchangeRates() {
  const res = await fetch("https://api.exchangeratesapi.io/latest?base=GBP");
  const { rates } = await res.json();

  return rates;
}

async function convertCurrency(payload) {
  console.log("convertCurrency: ", payload);
  await pause(2000); // simulate network request latency

  return new Promise((resolve, reject) => {
    resolve();
    // reject(new Error("Error converting currency"));
  });
}

export { getExchangeRates, convertCurrency };
