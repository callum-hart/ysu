import React, { useState, useEffect } from "react";

function renderPayload(payload) {
  if (payload && payload instanceof Error) {
    return <pre className="error">{payload.message}</pre>;
  }

  if (payload && typeof payload === "function") {
    return <pre className="function">{payload.toString()}</pre>;
  }

  return (
    <pre className={typeof payload}>{JSON.stringify(payload, null, 2)}</pre>
  );
}

function History({ title, history, timeTravel }) {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    setActiveIndex(history.length - 1);
  }, [history.length]);

  return (
    <section
      style={{
        border: "2px solid",
        resize: "both",
        overflow: "auto",
      }}
    >
      <strong>{title}</strong>
      <ul>
        {history.map(({ val, timestamp }, index) => (
          <li
            key={index}
            style={{
              background: activeIndex === index ? "grey" : "transparent",
            }}
          >
            {val.status} @ {timestamp}
            {renderPayload(val.payload)}
            <button
              onClick={() => {
                setActiveIndex(index);
                timeTravel(val);
              }}
            >
              Jump
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { History };
