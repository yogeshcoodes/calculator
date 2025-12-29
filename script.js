const display = document.getElementById("display");

/* ================= CONFIG ================= */
const CLICK_LOCK_TIME = 18; // ms
let clickLocked = false;

/* ================= SOUNDS ================= */
const clickSound = document.getElementById("click-s");
const clearSound = new Audio("clear-s-1.mp3");
const enterSound = new Audio("enter-s.mp3");

const lightSound = document.getElementById("light");
const darkSound = document.getElementById("dark");

/* ================= SOUND HELPER ================= */
function playSound(audio) {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

/* ================= CLICK LOCK ================= */
function lockClick() {
  if (clickLocked) return true;
  clickLocked = true;
  setTimeout(() => (clickLocked = false), CLICK_LOCK_TIME);
  return false;
}

/* ================= FORMATTERS ================= */

// remove commas for calculation
function rawValue(val) {
  return val.replace(/,/g, "");
}

// add commas safely
function formatNumber(val) {
  if (val === "" || isNaN(val)) return val;

  const parts = val.split(".");
  parts[0] = Number(parts[0]).toLocaleString("en-IN");
  return parts.join(".");
}

// auto scroll display to right
function autoScroll() {
  display.scrollLeft = display.scrollWidth;
}

/* ================= SAFE EVAL ================= */
function safeEval(expr) {
  // only allow numbers + operators
  if (!/^[0-9+\-*/%.() ]+$/.test(expr)) {
    throw new Error("Invalid Input");
  }

  // % handling
  expr = expr.replace(/(\d+)%/g, "($1/100)");

  return Function(`"use strict"; return (${expr})`)();
}

/* ================= MAIN PRESS ================= */
function press(value) {
  if (lockClick()) return;

  // CLEAR
  if (value === "clear") {
    playSound(clearSound);
    display.value = "";
    return;
  }

  // DELETE
  if (value === "delete") {
    playSound(clickSound);
    display.value = display.value.slice(0, -1);
    autoScroll();
    return;
  }

  // EQUALS
  if (value === "=") {
    playSound(enterSound);
    try {
      const result = safeEval(rawValue(display.value));
      display.value = formatNumber(String(result));
    } catch {
      display.value = "Error";
    }
    autoScroll();
    return;
  }

  // NORMAL INPUT
  playSound(clickSound);

  const current = rawValue(display.value);
  const next = current + value;

  // prevent operator spam
  if (/[\+\-*/.]$/.test(current) && /[\+\-*/.]$/.test(value)) return;

  display.value = formatNumber(next);
  autoScroll();
}

/* ================= KEYBOARD SUPPORT ================= */
document.addEventListener("keydown", (e) => {
  const keyMap = {
    Enter: "=",
    Backspace: "delete",
    Escape: "clear",
    "+": "+",
    "-": "-",
    "*": "*",
    "/": "/",
    ".": ".",
    "%": "%"
  };

  if (keyMap[e.key]) {
    e.preventDefault();
    press(keyMap[e.key]);
  } else if (/\d/.test(e.key)) {
    press(e.key);
  }
});

/* ================= THEME TOGGLE ================= */
const toggle = document.getElementById("themeToggle");

toggle.addEventListener("change", () => {
  const isLight = document.body.classList.toggle("light");
  playSound(isLight ? lightSound : darkSound);
});

/* ================= INPUT BEHAVIOR ================= */
// prevent manual typing junk
display.addEventListener("input", () => {
  display.value = formatNumber(rawValue(display.value));
  autoScroll();
});

// keep cursor at end always
display.addEventListener("focus", () => {
  display.selectionStart = display.selectionEnd = display.value.length;
});
