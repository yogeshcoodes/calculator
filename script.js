let display = document.getElementById("display");

// ================= SOUNDS =================
const clickSound = document.getElementById("click-s");
const clearSound = new Audio("clear-s-1.mp3");
const enterSound = new Audio("enter-s.mp3");

// theme sounds (NEW)
const lightSound = document.getElementById("light");
const darkSound = document.getElementById("dark");

// ================= SOUND HELPER =================
// zero delay, no overlap
function playSound(audio) {
  if (!audio) return;
  audio.pause();          // safety
  audio.currentTime = 0;
  audio.play().catch(() => {}); // mobile safe
}

// ================= BUTTON PRESS =================
function press(value) {
  if (value === "clear") {
    playSound(clearSound);
    display.value = "";
  } 
  else if (value === "=") {
    playSound(enterSound);
    try {
      display.value = eval(display.value.replace(/%/g, "/100"));
    } catch {
      display.value = "Error";
    }
  } 
  else if (value === "delete") {
    playSound(clickSound);
    display.value = display.value.slice(0, -1);
  } 
  else {
    playSound(clickSound);
    display.value += value;
  }
}

// ================= THEME TOGGLE =================
const toggle = document.getElementById("themeToggle");

toggle.addEventListener("change", () => {
  const isLight = document.body.classList.toggle("light");

  // theme sound
  if (isLight) {
    playSound(lightSound); // light mode ON
  } else {
    playSound(darkSound);  // dark mode ON
  }
});
