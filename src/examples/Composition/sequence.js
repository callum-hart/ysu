import { update } from "../../lib";

import { getExchangeRates, convertCurrency } from "./service";

async function* exchangeRatesSequence() {
  yield update("LOADING");

  try {
    const rates = await getExchangeRates();

    yield update("READY", { rates });
  } catch (error) {
    yield update("RATES_UNAVAILABLE");
  }
}

async function* convertCurrencySequence(payload) {
  yield update("SUBMITTING");

  try {
    await convertCurrency(payload);

    yield update("SUCCESS");
  } catch (error) {
    yield update("FAILED", error);
  }
}

async function* currencyConverterSequence(command, payload) {
  if (command === "LOAD_RATES") {
    yield* exchangeRatesSequence();
  } else if (command === "CONVERT_CURRENCY") {
    yield* convertCurrencySequence(payload);
  }
}

export { currencyConverterSequence };
