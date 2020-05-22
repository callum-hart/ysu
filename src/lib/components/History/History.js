import React, { useState, useEffect } from "react";
import cx from "classnames";

import styles from "./History.module.css";

function renderPayload(payload) {
  if (typeof payload === "undefined") {
    return null;
  }

  if (payload instanceof Error) {
    return <pre className="error">{payload.message}</pre>;
  }

  if (typeof payload === "function") {
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
    <section className={styles.history}>
      <p className={styles.history__title}>{title}</p>
      <ul className={styles.history__list}>
        {history.map(({ val, timestamp }, index) => (
          <li
            key={index}
            className={cx(styles.stage, {
              [styles["stage--active"]]: activeIndex === index,
            })}
          >
            <div className={styles.stage__header}>
              {val.status} @ {timestamp}
              {activeIndex !== index && (
                <button
                  onClick={() => {
                    setActiveIndex(index);
                    timeTravel(val);
                  }}
                >
                  Jump
                </button>
              )}
            </div>
            {renderPayload(val.payload)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export { History };
