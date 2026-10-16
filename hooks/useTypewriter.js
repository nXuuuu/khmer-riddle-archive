"use client";

import { useState, useEffect } from "react";

/**
 * useTypewriter — reveals `text` one character at a time using setInterval.
 * No external libraries; pure React + JS timer.
 *
 * @param {string}  text        The full string to type out.
 * @param {number}  speed       Ms per character (default 42).
 * @param {number}  startDelay  Ms to wait before typing begins (default 600).
 * @returns {{ displayed: string, done: boolean }}
 */
export default function useTypewriter(text, speed = 42, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) return;
    setDisplayed("");
    setDone(false);

    let index = 0;
    let interval;

    const delayId = setTimeout(() => {
      interval = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(delayId);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}
