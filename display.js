import 'bootstrap/dist/css/bootstrap.min.css';
import 'notyf/notyf.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./display.css";

import 'bootstrap';
import confetti from 'canvas-confetti';

const teamBlue = document.getElementById('team-blue');
const teamRed = document.getElementById('team-red');

const teamBlueScore = document.getElementById('team-blue-score-display');
const teamRedScore = document.getElementById('team-red-score-display');

const theme = document.getElementById("theme");
const wayof = document.getElementById("wayof");
const type = document.getElementById("type");
const players = document.getElementById("players");

// confetti =====
function triggerConfetti(team) 
{
  let color = team === "blue" ? "#0000ff" : "#b11414";
  let originX = team === "blue" ? 0 : 1;
  // let end = Date.now() + (0.1 * 1000);
    function frame() {
    confetti({
      particleCount: 80,
      angle: team === "blue" ? 60 : 120,
      spread: 50,
      origin: { x: originX },
      colors: ["#fff", `${color}`],
    });

    // if (Date.now() < end) {
    //   requestAnimationFrame(frame);
    // }
  }

  frame();
}

function firework() 
{
  let duration = 8 * 1000;
  let animationEnd = Date.now() + duration;
  let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  let interval = setInterval(function() {
    let timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    let particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}
// =====

// Utilities =====
function pad(nb) 
{
  if (nb == 0) {
    return "00"
  }
  if (nb <= 9) {
    nb = "0" + nb;
  }
  return nb;
}

function initRenderData()
{
  ["blue", "red"].forEach((team) => {
    const name = window.electronAPI.getTeamName(team);
    document.getElementById(`team-${team}`).textContent = name?.toUpperCase() || "-";

    const score = window.electronAPI.getScore(team);
    document.getElementById(`team-${team}-score-display`).textContent = score;
  });

  ["blue", "red"].forEach((team) => {
    const foulsCount = window.electronAPI.getFouls(team);
    const foulsEls = document.querySelectorAll(`.foul-${team}`);
    foulsEls.forEach((el, i) => {
      if (i < foulsCount) {
        el.classList.remove("fouls-empty");
        el.classList.add("fouls-filled");
      } else {
        el.classList.remove("fouls-filled");
        el.classList.add("fouls-empty");
      }
    });
  });

  ["main", "sub"].forEach((timer) => {
    const value = window.electronAPI.getTimer(timer);
    const mins = Math.floor(value / 60);
    const secs = value % 60;
    document.getElementById(`${timer}-timer`).textContent = `${pad(mins)}:${pad(secs)}`;
  });

  document.getElementById("theme").textContent = window.electronAPI.getTheme();
  const wayofDisplay = window.electronAPI.getWayof();
  document.getElementById("wayof").textContent = wayofDisplay ? `À la manière de : ${wayofDisplay}` : "";
  const typeDisplay = window.electronAPI.getType();
  document.getElementById("type").textContent = typeDisplay ? `Impro. ${typeDisplay}` : "";
  const playersDisplay = window.electronAPI.getPlayers();
  document.getElementById("players").textContent = playersDisplay ? `Nb de joueurs : ${playersDisplay}` : "";
}

window.electronAPI.onAppReset(() => {
  initRenderData();
});

window.addEventListener("DOMContentLoaded", () => {
  initRenderData();
});

function updateTeamName(teamColor, teamName) {
  if (teamColor == "blue") {
    teamBlue.textContent = teamName;
  }
  else {
    teamRed.textContent = teamName;
  }
}

function updateTeamScore(teamColor, score, trigger) {
  if (teamColor == "blue") {
    teamBlueScore.textContent = score;
    if (trigger === true) {
      triggerConfetti("blue")
    }
  }
  else {
    teamRedScore.textContent = score;
    if (trigger === true) {
      triggerConfetti("red")
    }
  }
}

function updateTheme(text) {
  theme.textContent = text;
}

function updateWayof(text) {
  wayof.textContent = text ? "A la manière de : " + text : "";
}

function updateType(text) {
  type.textContent = text ? "Impro. " + text : "";
}

function updatePlayers(text) {
  players.textContent = text ? "Nb de joueurs : " + text : "";
}

function updateTimerDisplay(timerId, timeInSec) {
  const timerRender = document.getElementById(`${timerId}-timer`);
  let mins = Math.floor(timeInSec / 60);
  let secs = timeInSec % 60;
  timerRender.textContent = pad(mins) + ":" + pad(secs);
}

window.electronAPI.onFoulUpdate((team, count) => {
  const foulsEls = document.querySelectorAll(`.foul-${team}`);
  foulsEls.forEach((el, i) => {
    if (i < count) {
      el.classList.remove("fouls-empty");
      el.classList.add("fouls-filled");
    } else {
      el.classList.add("fouls-empty");
      el.classList.remove("fouls-filled");
    }
  });
});

window.electronAPI.onTeamUpdate((teamColor, teamName) => {
  updateTeamName(teamColor, teamName);
});

window.electronAPI.onScoreUpdate((teamColor, teamName, trigger) => {
  updateTeamScore(teamColor, teamName, trigger);
});

window.electronAPI.onThemeUpdate((text) => {
  updateTheme(text);
});

window.electronAPI.onWayofUpdate((text) => {
  updateWayof(text);
});

window.electronAPI.onTypeUpdate((text) => {
  updateType(text);
});

window.electronAPI.onPlayersUpdate((text) => {
  updatePlayers(text);
});

window.electronAPI.onTimerSet((timer, timeInSec) => {
  updateTimerDisplay(timer, timeInSec);
});

window.electronAPI.onTimerUpdate(( timer, timeInSec ) => {
  updateTimerDisplay(timer, timeInSec)
});

window.electronAPI.onTriggerFirework(() => {
  firework();
});