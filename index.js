import React, { useEffect } from "react";

async function* randomQuote() {
  yield { status: "LOADING" };

  try {
    const res = await fetch(
      "https://programming-quotes-api.herokuapp.com/quotes/random"
    );
    const data = await res.json();

    yield { status: "READY", payload: data };
  } catch (error) {
    yield { status: "FAILED", payload: error };
  }
}

function sequence(mapSequenceToProps) {
  return function (WrappedComponent) {
    return class extends React.Component {
      constructor(props) {
        super(props);

        this.state = Object.keys(mapSequenceToProps).reduce(
          (acc, sequenceId) => {
            return {
              ...acc,
              [sequenceId]: [
                {}, // could set a default status?
                async (...args) => {
                  for await (const val of mapSequenceToProps[sequenceId](
                    ...args
                  )) {
                    this.setState({
                      [sequenceId]: [
                        val,
                        this.state[sequenceId][1], // points to itself
                      ],
                    });
                  }
                },
              ],
            };
          },
          {}
        );
      }

      render() {
        return <WrappedComponent {...this.props} {...this.state} />;
      }
    };
  };
}

export const MyComponent = (props) => {
  const [{ status, payload }, dispatcher] = props.quote;

  useEffect(() => {
    dispatcher();
  }, [dispatcher]);

  if (status === "LOADING") {
    return <p>Loading...</p>;
  }

  if (status === "READY") {
    return (
      <>
        <q>{payload.en}</q>
        <br />
        <br />
        <button onClick={dispatcher}>Get another quote</button>
      </>
    );
  }

  if (status === "FAILED") {
    return <p>{payload.message}</p>;
  }

  return null;
};

export default sequence({
  quote: randomQuote,
})(MyComponent);
