import React, { useState, useEffect, useRef } from "react";
import cx from "classnames";
import { Rnd } from "react-rnd";

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
  const [theme, setTheme] = useState(
    localStorage.getItem("ysuTheme") || "dark"
  );
  const position = JSON.parse(
    localStorage.getItem(`ysuPosition-${sequenceId}`)
  ) || {
    x: 0,
    y: 0,
  };
  const dimension = JSON.parse(
    localStorage.getItem(`ysuDimension-${sequenceId}`)
  ) || {
    width: 300,
    height: 400,
  };
  const scrollToRef = useRef(null);
  const historyRefs = history.reduce((acc, value, index) => {
    acc[index] = React.createRef();
    return acc;
  }, []);

  function toggleTheme() {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem("ysuTheme", "light");
    } else {
      setTheme("dark");
      localStorage.setItem("ysuTheme", "dark");
    }
  }

  function handleNewActiveIndex(newActiveIndex) {
    setActiveIndex(newActiveIndex);
    timeTravel(history[newActiveIndex].val);
    historyRefs[newActiveIndex].current.scrollIntoView();
  }

  function goBack() {
    const newActiveIndex = activeIndex - 1;

    if (newActiveIndex > -1) {
      handleNewActiveIndex(newActiveIndex);
    }
  }

  function goForward() {
    const newActiveIndex = activeIndex + 1;

    if (newActiveIndex < history.length) {
      handleNewActiveIndex(newActiveIndex);
    }
  }

  useEffect(() => {
    setActiveIndex(history.length - 1);

    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView();
    }
  }, [history.length]);

  return (
    <Rnd
      className={styles["rnd--ysu"]}
      default={{
        ...position,
        ...dimension,
      }}
      minWidth={300}
      minHeight={300}
      dragHandleClassName="js-drag-handle"
      onDragStop={(event, { x, y }) => {
        localStorage.setItem(
          `ysuPosition-${sequenceId}`,
          JSON.stringify({ x, y })
        );
      }}
      onResizeStop={(event, direction, { offsetWidth, offsetHeight }) => {
        localStorage.setItem(
          `ysuDimension-${sequenceId}`,
          JSON.stringify({ width: offsetWidth, height: offsetHeight })
        );
      }}
      aria-hidden="true"
    >
      <section className={cx(styles.history, styles[`history--${theme}`])}>
        <div className={cx(styles.header, "js-drag-handle")}>
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
            <input
              className={styles.switch__checkbox}
              type="checkbox"
              id="theme"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <span className={styles.switch_slider}></span>
          </label>
        </div>
        <ul className={styles.history__list}>
          {history.map(({ val, timestamp }, index) => (
            <li
              key={index}
              ref={historyRefs[index]}
              className={cx(styles.stage, {
                [styles["stage--active"]]: activeIndex === index,
                [styles["stage--last"]]: history.length - 1 === index,
              })}
            >
              <div className={styles.stage__header}>
                <span
                  className={cx(styles.stage__status, {
                    [styles["stage__status--idle"]]: val.status === "@IDLE",
                  })}
                >
                  {val.status}
                </span>
                <span className={styles.stage__timestamp}>{timestamp}</span>
                <button
                  type="button"
                  className={styles.button}
                  disabled={activeIndex === index}
                  tabIndex="-1"
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
          <li ref={scrollToRef} aria-hidden="true"></li>
        </ul>
        <div className={cx(styles.footer, "js-drag-handle")}>
          <button
            type="button"
            className={styles.button}
            disabled={activeIndex === 0}
            tabIndex="-1"
            onClick={goBack}
          >
            Back
          </button>
          <button
            type="button"
            className={styles.button}
            disabled={activeIndex === history.length - 1}
            tabIndex="-1"
            onClick={goForward}
          >
            Forward
          </button>
        </div>
      </section>
    </Rnd>
  );
}

export { History };
