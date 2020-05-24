import React, { useState, useEffect } from "react";
import cx from "classnames";
import Switch from "react-switch";

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
  const [theme, setTheme] = useState("dark"); // TODO: save in localStorage

  function toggleTheme() {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  useEffect(() => {
    setActiveIndex(history.length - 1);
    // TODO: scroll into view
  }, [history.length]);

  return (
    <section className={cx(styles.history, styles[`history--${theme}`])}>
      <div className={styles.header}>
        <p className={styles.header__title}>{sequenceId}</p>
        <label className={styles.switch}>
          <>
            {theme === "dark" && (
              <span className={styles.switch__label}>Light</span>
            )}
            {theme === "light" && (
              <span className={styles.switch__label}>Dark</span>
            )}
          </>
          <Switch
            checked={theme === "dark"}
            onChange={toggleTheme}
            uncheckedIcon={false}
            checkedIcon={false}
            height={15}
            width={30}
            handleDiameter={11}
            offColor="#7f8188"
            onColor="#7f8188"
            offHandleColor="#cbcbcd"
            onHandleColor="#1f2027"
            activeBoxShadow="0 0 0 2px #a8cbf5"
          />
        </label>
      </div>
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
