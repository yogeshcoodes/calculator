let display = document.getElementById("display");

// sounds
const clickSound = document.getElementById("click-sound");
const clearSound = new Audio("clear.mp3");
const enterSound = new Audio("enter.wav");

// small helper (no delay, no overlap bug)
function playSound(audio) {
  audio.currentTime = 0;
  audio.play();
}

function press(value) {
  // ---- SOUND LOGIC ----
  if (value === "clear") {
    playSound(clearSound);
    display.value = "";
  } else if (value === "=") {
    playSound(enterSound);
    try {
      display.value = eval(display.value.replace(/%/g, "/100"));
    } catch {
      display.value = "Error";
    }
  } else if (value === "delete") {
    playSound(clickSound);
    display.value = display.value.slice(0, -1);
  } else {
    playSound(clickSound);
    display.value += value;
  }
}

// Theme Toggle (unchanged)
const toggle = document.getElementById("themeToggle");
toggle.addEventListener("change", () => {
  document.body.classList.toggle("light");
});
