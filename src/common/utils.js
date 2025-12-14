import confetti from "canvas-confetti";


// ===== Confetti stuff =====

export function triggerConfetti(team) {
  let color = team === "blue" ? "#0000ff" : "#b11414";
  let originX = team === "blue" ? 0 : 1;
  // let end = Date.now() + (0.1 * 1000);
  function frame() {
    confetti({
      particleCount: 200, // 80
      angle: team === "blue" ? 60 : 120, // 60 : 120
      spread: 55, //50
      startVelocity: 70, //45
      origin: { x: originX },
      colors: ["#fff", `${color}`],
    });
    // if (Date.now() < end) {
    //   requestAnimationFrame(frame);
    // }
  }
  frame();
}

export function firework() {
  let duration = 8 * 1000;
  let animationEnd = Date.now() + duration;
  let defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    colors: ["#b11414", "#ffffff", "#0000ff"],
  };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  let interval = setInterval(function () {
    let timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    let particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

// ==========

// ===== Utils =====

export function pad(nb) 
{
  if (nb == 0) {
    return "00"
  }
  if (nb <= 9) {
    nb = "0" + nb;
  }
  return nb;
}

// ==========