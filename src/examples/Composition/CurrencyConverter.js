import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonSkeleton,
  Form,
  FormGroup,
  TextInput,
  TextInputSkeleton,
  Select,
  SelectItem,
  SelectSkeleton,
  InlineNotification,
  InlineLoading,
  Tile,
} from "carbon-components-react";

import { sequence } from "../../lib";
import { currencyConverterSequence } from "./sequence";

export const CurrencyConverter = (props) => {
  const [
    { status, payload },
    transition,
    { devTools },
  ] = props.currencyConverter;
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");

  const renderForm = () => (
    <Form action="#" autoComplete="off">
      <FormGroup>
        <TextInput
          id="amount"
          labelText="Amount (£)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Select
          id="rates"
          labelText="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <SelectItem value={null} text="-- Please choose --" />
          {Object.keys(payload.rates).map((currency) => (
            <SelectItem key={currency} value={currency} text={currency} />
          ))}
        </Select>
      </FormGroup>
      {amount && currency && (
        <Tile>
          <p>
            <strong>GBP</strong> {amount}
          </p>
          <p>
            <strong>{currency}</strong>{" "}
            {(amount * payload.rates[currency]).toFixed(2)}
          </p>
          <p>
            <strong>Rate</strong> {payload.rates[currency].toFixed(2)}
          </p>
        </Tile>
      )}
      <Button
        disabled={!amount || !currency}
        onClick={() => transition("CONVERT_CURRENCY", { amount, currency })}
      >
        Submit
      </Button>
    </Form>
  );

  useEffect(() => {
    transition("LOAD_RATES");
  }, [transition]);

  return (
    <>
      <h1>Currency Converter</h1>

      {status === "LOADING" && (
        <>
          <TextInputSkeleton />
          <SelectSkeleton />
          <ButtonSkeleton />
        </>
      )}

      {status === "RATES_UNAVAILABLE" && (
        <>
          <InlineNotification
            hideCloseButton={true}
            kind="error"
            title="Exchange rates unavailable"
          />
          <Button onClick={() => transition("LOAD_RATES")}>Try again</Button>
        </>
      )}

      {status === "READY" && <>{renderForm()}</>}

      {status === "SUBMITTING" && (
        <InlineLoading description="Converting currency" />
      )}

      {status === "SUCCESS" && (
        <InlineNotification
          hideCloseButton={true}
          kind="success"
          title="Currency converted"
        />
      )}

      {status === "FAILED" && (
        <InlineNotification
          hideCloseButton={true}
          kind="error"
          title={payload.message}
        />
      )}

      {props.showDevTools && <>{devTools}</>}
    </>
  );
};

export default sequence({
  currencyConverter: currencyConverterSequence,
})(CurrencyConverter);
