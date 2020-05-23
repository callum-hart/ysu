import React, { useState, useEffect } from "react";
import cx from "classnames";

import styles from "./History.module.css";

function renderPayload(payload) {
  if (typeof payload === "undefined") {
    return null;
  }

  if (payload instanceof Error) {
    return (
      <pre className={cx(styles.payload, styles["payload--error"])}>
        {payload.message}
      </pre>
    );
  }

  if (typeof payload === "function") {
    return (
      <pre className={cx(styles.payload, styles["payload--function"])}>
        {payload.toString()}
      </pre>
    );
  }

  return (
    <pre className={cx(styles.payload, styles[`payload--${typeof payload}`])}>
      {JSON.stringify(payload, null, 2)}
    </pre>
  );
}

function History({ sequenceId, history, timeTravel }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const theme = "dark"; // TODO: add toggle to change theme

  useEffect(() => {
    setActiveIndex(history.length - 1);
  }, [history.length]);

  return (
    <section className={cx(styles.history, styles[`history--${theme}`])}>
      <p className={styles.history__title}>{sequenceId}</p>
      <ul className={styles.history__list}>
        {history.map(({ val, timestamp }, index) => (
          <li
            key={index}
            className={cx(styles.stage, {
              [styles["stage--active"]]: activeIndex === index,
            })}
          >
            <div className={styles.stage__header}>
              <span className={styles.stage__status}>{val.status}</span>
              <span className={styles.stage__timestamp}>{timestamp}</span>
              <button
                className={styles.stage__button}
                disabled={activeIndex === index}
                onClick={() => {
                  setActiveIndex(index);
                  timeTravel(val);
                }}
              >
                View
              </button>
            </div>
            {renderPayload(val.payload)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export { History };
