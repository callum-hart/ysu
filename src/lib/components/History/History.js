import React, { useState, useEffect, useRef } from "react";
import cx from "classnames";
import { Rnd } from "react-rnd";

import { payloadToString } from "../../utils/helpers";

import styles from "./History.module.css";

function renderCode(payload) {
  if (typeof payload === "undefined") {
    return null;
  }

  const { type, string } = payloadToString(payload);

  return (
    <pre className={cx(styles.payload, styles[`payload--${type}`])}>
      {string}
    </pre>
  );
}

function History({
  sequenceId,
  history,
  isRunning,
  isSuspended,
  error,
  suspend,
  timeTravel,
}) {
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
  }, [history.length, isSuspended, error]);

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
      // TODO check this out: https://stackoverflow.com/questions/63568611/set-text-for-screen-reader-and-hide-children-from-screen-readers
      aria-hidden="true"
    >
      <section className={cx(styles.history, styles[`history--${theme}`])}>
        <div className={cx(styles.header, "js-drag-handle")}>
          <p className={styles.header__title}>
            {sequenceId}
            <span
              className={cx(styles.signal, {
                [styles["signal--running"]]: isRunning,
                [styles["signal--suspended"]]: isSuspended,
                [styles["signal--error"]]: error,
              })}
            />
          </p>
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
              className={cx(styles.entry, {
                [styles["entry--active"]]: activeIndex === index,
                [styles["entry--last"]]: history.length - 1 === index,
              })}
            >
              <div className={styles.entry__header}>
                <span
                  className={cx(styles.entry__status, {
                    [styles["entry__status--idle"]]: val.status === "@IDLE",
                  })}
                >
                  {val.status}
                </span>
                <span className={styles.entry__timestamp}>{timestamp}</span>
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
              {renderCode(val.payload)}
            </li>
          ))}
          {error && (
            <li className={cx(styles.entry, styles[`entry--error`])}>
              <div className={styles.entry__header}>
                <span className={cx(styles.entry__status)} />
                <span className={styles.entry__timestamp}>
                  {error.timestamp}
                </span>
              </div>
              {renderCode(new Error(error.message))}
            </li>
          )}
          <li ref={scrollToRef} aria-hidden="true"></li>
        </ul>
        <div className={cx(styles.footer, "js-drag-handle")}>
          {isRunning && !isSuspended && (
            <button
              type="button"
              className={styles.button}
              tabIndex="-1"
              onClick={suspend}
            >
              Stop
            </button>
          )}
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
            data-qa="forward-button"
          >
            Forward
          </button>
        </div>
      </section>
    </Rnd>
  );
}

export { History };
