import React, { useEffect, useState } from "react";

import { sequence } from "../../lib";
import { currencyConverterSequence } from "./sequence";

export const CurrencyConverter = (props) => {
  const [
    { status, payload },
    transition,
    { history },
  ] = props.currencyConverter;
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");

  useEffect(() => {
    transition("LOAD_RATES");
  }, [transition]);

  return (
    <>
      {status === "LOADING" && <p>Loading...</p>}

      {status === "RATES_UNAVAILABLE" && (
        <>
          <p>Exchange rates unavailable</p>
          <button onClick={() => transition("LOAD_RATES")}>Try again</button>
        </>
      )}

      {status === "READY" && (
        <form action="#">
          <input
            type="text"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            name="rates"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value={null}>-- Please Choose --</option>
            {Object.keys(payload.rates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          {amount && currency && (
            <>
              <p>Rate: {payload.rates[currency]}</p>
              <p>
                {amount} GDP buys you {amount * payload.rates[currency]}{" "}
                {currency}
              </p>
            </>
          )}
          <button
            disabled={!amount || !currency}
            onClick={() => transition("CONVERT_CURRENCY", { amount, currency })}
          >
            Submit
          </button>
        </form>
      )}

      {status === "SUBMITTING" && <p>Submitting...</p>}
      {status === "SUCCESS" && <p>Success!</p>}
      {status === "FAILED" && <p>{payload.message}</p>}

      {props.showYsuHistory && <>{history}</>}
    </>
  );
};

export default sequence({
  currencyConverter: currencyConverterSequence,
})(CurrencyConverter);
