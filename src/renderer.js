import 'bootstrap/dist/css/bootstrap.min.css';
import 'notyf/notyf.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";


import 'bootstrap';
import { Notyf } from 'notyf';
import confetti from 'canvas-confetti';

// VARS =====
let blueScore = getScore("blue") ?? 0;
let redScore = getScore("red") ?? 0;

let blueFouls = getTeamFouls("blue") ?? 0;
let redFouls = getTeamFouls("red") ?? 0;

let confettiParam = getConfettiParam();
let switchConfetti = document.getElementById("switchConfetti");

const openBtn = document.getElementById('openDisplay');
const resetBtn = document.getElementById('resetStorage');

const teamBlueForm = document.getElementById('team-blue-form');
const teamRedForm = document.getElementById('team-red-form');

const teamRedScore = document.getElementById('red-score');
const teamBlueScore = document.getElementById('blue-score');

const teamBlueControl = document.querySelectorAll('button[id^="blue-score-"]');
const teamRedControl = document.querySelectorAll('button[id^="red-score-"]');

const themeForm = document.getElementById("theme-form");
const themeClear = document.getElementById("theme-clear");

const wayofForm = document.getElementById("wayof-form");
const wayofClear = document.getElementById("wayof-clear");

const batchClear = document.getElementById("batch-clear");

const type = document.getElementById("type");
const players = document.getElementById("players");

const mainTimerForm = document.getElementById("main-timer-form");
const subTimerForm = document.getElementById("sub-timer-form");

const fireworkButton = document.getElementById("firework");
let fireworkSwitch = document.getElementById("switchFirework");
// =====

// Notifications =====
const notyf = new Notyf({
  duration: 2000,
  position: { x: 'center', y: 'top' },
});
const notyfLeft = new Notyf({ position: { x: 'left' }, duration: 900 });
const notyfRight = new Notyf({ position: { x: 'right' }, duration: 900 });

function showNotyf(options) {
  const { side, type = 'success', message } = options;
  if (side === 'left') {
    notyfLeft[type](message);
  } else if ((side === 'right')) {
    notyfRight[type](message);
  } else {
    notyf[type](message)
  }
}
// =====

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

switchConfetti.addEventListener("change", () => {
confettiParam = switchConfetti.checked
localStorage.setItem("confetti", confettiParam);
})

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

fireworkButton.addEventListener("click", () => {
  if (fireworkSwitch.checked) {
    triggerFirework();
    firework();
  }
  else {
    notyf.error("Bouton FIREWORK désactivé ! Réactiver dans les paramètres");
  }
});
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

// =====

function initRenderData() 
{
  // Teams
  ["blue", "red"].forEach((team) => {    
    const name = getTeamName(team);
    const teamName = document.getElementById(`team-${team}-display`);
    if (name === null || name === "-") 
    {
      teamName.textContent = "-";
    }
    else 
    {
      document.getElementById(`team-${team}`).value = name;
      teamName.textContent = name.toUpperCase();
    }
    updateTeamName(team, name);

    // Scores
    const score = getScore(team) ?? 0;
    const teamScore = document.getElementById(`${team}-score`);
    teamScore.textContent = score;
    updateScores(team, score);
  });

  // Timers
  ["main", "sub"].forEach((timer) => {
    const timerValue = getTimer(timer);
    const timerRender = document.getElementById(`${timer}-timer-render`);
    let mins = Math.floor(timerValue / 60);
    let secs = timerValue % 60;
    timerRender.textContent = pad(mins) + ":" + pad(secs);
  });

  // Fouls
  ["blue", "red"].forEach((team) => {
    let teamFouls = getTeamFouls(team) ?? 0;
    let foulsDisplay = document.querySelectorAll(`.${team}-foul`);
    if (teamFouls > 0)
    {
      for (let i = 0; i < (teamFouls); i++)
        {
        foulsDisplay[i].classList.remove("fouls-empty");
        foulsDisplay[i].classList.add("fouls-filled");
      }
    }
    else 
    {
      for (let i = 0; i < 3; i++)
        {
        foulsDisplay[i].classList.remove("fouls-filled");
        foulsDisplay[i].classList.add("fouls-empty");
      }
    }
  });

  let theme = getTheme();
  document.getElementById("theme").value = theme;
  document.getElementById("theme-display").textContent = theme;
  
  let wayof = getWayof();
  document.getElementById("wayof").value = wayof;
  document.getElementById("wayof-display").textContent = wayof ? "À la manière de : " + wayof : "";  

  let type = getType();
  document.getElementById("type").value = type;
  document.getElementById("type-display").textContent = type ? "Impro. " + type : "";

  let players = getPlayers();
  document.getElementById("players").value = players;
  document.getElementById("players-display").textContent = players ? "nb de joueurs : " + players : "";

  if (!localStorage.getItem("confetti"))
  {
    localStorage.setItem("confetti", true)
  }
}

function resetAppData()
{
  ["blue", "red"].forEach((team) => {    
    localStorage.setItem(`team-${team}`, "-");
    localStorage.setItem(`${team}-score`, 0);
    blueScore = 0;
    redScore = 0;
    localStorage.setItem(`${team}-fouls`, 0);
    blueFouls = 0;
    redFouls = 0;
    document.getElementById(`team-${team}-form`).reset();
  });
  ["main", "sub"].forEach((timer) => {
    localStorage.setItem(`${timer}-timer`, 0);
    localStorage.setItem(`${timer}-timer-status`, "stopped");
  });
  ["type", "theme", "wayof", "players"].forEach((item) => {
    localStorage.setItem(item, "");
  })
  if (!localStorage.getItem("confetti"))
  {
    localStorage.setItem("confetti", true)
  }
}

window.addEventListener("DOMContentLoaded", () => {
  ["main", "sub"].forEach((timer) => {
    const status = localStorage.getItem(`${timer}-timer-status`);
    if (status === "running") {
      localStorage.setItem(`${timer}-timer-status`, "stopped");
    }
  });
  initRenderData();
});

resetBtn.addEventListener("click", () => {
  const mainStatus = localStorage.getItem("main-timer-status");
  const subStatus = localStorage.getItem("sub-timer-status");

  if (mainStatus === "running" || subStatus === "running") {
    notyf.error("Impossible de réinitialiser pendant qu'un timer est en cours.");
    return;
  }
  resetAppData();
  initRenderData();
  window.electronAPI.sendReset();
  showNotyf({side: "center", message: "Données remises à zéro"});
});

// Team Names =====
teamBlueForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let buttonId = event.target.id;
  let color = buttonId.split("-")[1];
  setTeamName(color);
  showNotyf({side: "left", message: "Blue Team paramétrée!"});
});

teamRedForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let buttonId = event.target.id;
  let color = buttonId.split("-")[1];
  setTeamName(color);
  showNotyf({side: "right", message: "Red Team paramétrée!"});
});

/**
 * Set team name
 * @param {string} color - team color (eg. "blue", "red")
 * @returns {void}
 */
function setTeamName(color) 
{
  let team = document.getElementById(`team-${color}`).value;
  if (team === "") {
    team = "-";
  }
  localStorage.setItem(`team-${color}`, team);
  const teamDisplay = document.getElementById(`team-${color}-display`);
  teamDisplay.textContent = team.toUpperCase();
  updateTeamName(color, team);
}

/**
 * Get team name from localStorage.
 * @param {string} timer - Team color (eg. "blue", "red")
 * @returns {string|null} - Team name
 */
function getTeamName(color) 
{
  let teamName = localStorage.getItem(`team-${color}`);
  return teamName;
}

function updateTeamName(teamColor, teamName) 
{
  window.electronAPI.sendTeamUpdate(teamColor, teamName);
}
// =====

// Timers =====
let timerIntervals = {
  main: null,
  sub: null,
};

let timerStatus = {
  main: "stopped",
  sub: "stopped",
};

["main", "sub"].forEach((key) => {
  document.getElementById(`${key}-timer-start`).addEventListener("click", () => {
    startTimer(key);
  });

  document.getElementById(`${key}-timer-stop`).addEventListener("click", () => {
    stopTimer(key);
  });
});

function startTimer(timerKey) {
  let time = parseInt(localStorage.getItem(`${timerKey}-timer`)) || 0;

  clearInterval(timerIntervals[timerKey]);
  timerIntervals[timerKey] = null;

  if (time <= 0) return;

  if (timerStatus[timerKey] = "running") {
    notyf.success(`${timerKey}-timer lancé`);
  }
  localStorage.setItem(`${timerKey}-timer-status`, "running");

  timerStatus[timerKey] = "running";

  timerIntervals[timerKey] = setInterval(() => {
    if (time <= 0) {
      clearInterval(timerIntervals[timerKey]);
      timerIntervals[timerKey] = null;
      timerStatus[timerKey] = "stopped";
      localStorage.setItem(`${timerKey}-timer-status`, "stopped");
      notyf.success(`${timerKey}-timer écoulé`);
      return;
    }

    time--;

    updateTimerDisplay(timerKey, time);
    localStorage.setItem(`${timerKey}-timer`, time);
    window.electronAPI.sendTimerUpdate(timerKey, time);
  }, 1000);
}

function stopTimer(timerKey) {
  clearInterval(timerIntervals[timerKey]);
  timerIntervals[timerKey] = null;
  notyf.error(`${timerKey}-timer arrêté`);
  localStorage.setItem(`${timerKey}-timer-status`, "stopped");
}

function updateTimerDisplay(key, seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  document.getElementById(`${key}-timer-render`).textContent = `${pad(mins)}:${pad(secs)}`;
}

/**
 * Set timer
 * @param {string} timer - Timer name (eg. "main", "sub")
 * @returns {void}
 */
function setTimer(timer) 
{
  const mins = parseInt(document.getElementById(`${timer}-mins`).value, 10) || 0;
  const secs = parseInt(document.getElementById(`${timer}-secs`).value, 10) || 0;
  const total = mins * 60 + secs;

  localStorage.setItem(`${timer}-timer`, total);
  localStorage.setItem(`${timer}-timer-status`, "stopped");

  updateTimerDisplay(timer, total);

  document.getElementById(`${timer}-timer-form`).reset();
  window.electronAPI.sendTimerSet(timer, total);
  notyf.success(`${timer}-timer paramétré`)
}

/**
 * Get timer value from localStorage.
 * @param {string} timer - Timer name (eg. "main", "sub")
 * @returns {number|null} - timer value, in seconds
 */
function getTimer(timer) 
{
  return parseInt(localStorage.getItem(`${timer}-timer`), 10) || 0;
}

mainTimerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (localStorage.getItem("main-timer-status") === "running") {
    notyf.error("Impossible d'initialiser pendant que le timer est en cours.");
    return;
  }
  setTimer("main");
});

subTimerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (localStorage.getItem("sub-timer-status") === "running") {
    notyf.error("Impossible d'initialiser pendant que le timer est en cours.");
    return;
  }
  setTimer("sub");
})
// =====

// Scores Controls =====
teamBlueControl.forEach((button) => {
  button.addEventListener('click', (event) => {
    let action = event.target.id.split('-').pop();
    let trigger;
    if (action == "plus") {
      blueScore++;
      showNotyf({side: "left", message: "Blue score +"});
      if (confettiParam) {
        trigger = true;
        triggerConfetti("blue");
      }
    } else {
      if (blueScore > 0) {
        blueScore--;
        trigger = false;
        showNotyf({side: "left", message: "Blue score -"});
      }
    }
    teamBlueScore.textContent = blueScore;
    localStorage.setItem("blue-score", blueScore);
    updateScores("blue", blueScore, trigger);
  });
});

teamRedControl.forEach((button) => {
  button.addEventListener('click', (event) => {
    let action = event.target.id.split('-').pop();
    let trigger;
    if (action == "plus") {
      redScore++;
      if (confettiParam) {
        trigger = true;
        triggerConfetti("red");
      }
      showNotyf({side: "right", message: "Red score +"});
    } else {
      if (redScore > 0) {
        redScore--;
        trigger = false;
        showNotyf({side: "right", message: "Red score -"});
      };
    }
    teamRedScore.textContent = redScore;
    localStorage.setItem("red-score", redScore);
    updateScores("red", redScore, trigger);
  });
});

/**
 * Get score value from localStorage.
 * @param {string} color - team color (eg. "blue", "red")
 * @returns {number|null} - score value
 */
function getScore(color) 
{
  return localStorage.getItem(`${color}-score`);
}

function updateScores(teamColor, score, trigger) 
{
  window.electronAPI.sendScoreUpdate(teamColor, score, trigger);
}
// =====


// Fouls control =====
function updateFoulDisplay(team, count) {
  const fouls = document.querySelectorAll(`.${team}-foul`);
  fouls.forEach((el, i) => {
    if (i < count) {
      el.classList.add("fouls-filled");
      el.classList.remove("fouls-empty");
    } else {
      el.classList.add("fouls-empty");
      el.classList.remove("fouls-filled");
    }
  });
}

function setFouls(team, count) {
  const clampedCount = Math.min(Math.max(count, 0), 3);
  localStorage.setItem(`${team}-fouls`, clampedCount);
  updateFoulDisplay(team, clampedCount);
  window.electronAPI.sendFoulUpdate(team, clampedCount); // envoi à display
}

["red", "blue"].forEach((team) => {
  document.getElementById(`${team}-foul-plus`).addEventListener("click", () => {
    const current = parseInt(localStorage.getItem(`${team}-fouls`) || 0);
    const next = current < 3 ? current + 1 : 0; // reset si 3
    setFouls(team, next);
    showNotyf({side: team === "blue" ? "left" : "right", message: next === 0 ? "Reset Fautes" : "Faute +"});
  });

  document.getElementById(`${team}-foul-minus`).addEventListener("click", () => {
    const current = parseInt(localStorage.getItem(`${team}-fouls`) || 0);
    const next = Math.max(current - 1, 0);
    setFouls(team, next);
    showNotyf({side: team === "blue" ? "left" : "right", message: "Faute -"});
  });
});

/**
 * Get team fouls from localStorage.
 * @param {string} timer - Team color (eg. "blue", "red")
 * @returns {string|null} - Team fouls
 */
function getTeamFouls(color) 
{
  return localStorage.getItem(`${color}-fouls`);
}
//  =====

// Theme =====
themeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const theme = document.getElementById("theme").value;
  const themeDisplay = document.getElementById("theme-display");
  themeDisplay.textContent = theme;
  updateTheme(theme);
})

themeClear.addEventListener("click", () => {
  const theme = document.getElementById("theme");
  const themeDisplay = document.getElementById("theme-display");
  theme.value = "";
  themeDisplay.textContent = "";
  updateTheme(theme);
})

function getTheme()
{
  return localStorage.getItem("theme");
}

function updateTheme(theme) 
{
  localStorage.setItem("theme", theme);
  window.electronAPI.sendThemeUpdate(theme);
}

// =====

//  Way of =====
wayofForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const wayof = document.getElementById("wayof").value;
  const wayofDisplay = document.getElementById("wayof-display");
  if (wayof !== "") {
    wayofDisplay.textContent = "À la manière de : " + wayof;
    updateWayof(wayof);
  } else {
    wayofDisplay.textContent = "";
    updateWayof("");
  }
})

wayofClear.addEventListener("click", () => {
  const wayof = document.getElementById("wayof");
  const wayofDisplay = document.getElementById("wayof-display");
  wayof.value = "";
  wayofDisplay.textContent = "";
  updateWayof("")
})

function getWayof() 
{
  return localStorage.getItem("wayof");
}

function updateWayof(wayof) 
{
  localStorage.setItem("wayof", wayof);
  window.electronAPI.sendWayofUpdate(wayof);
}
// =====

// Batch Update =====
batchClear.addEventListener("click", () => {
  // Theme
  const theme = document.getElementById("theme");
  const themeDisplay = document.getElementById("theme-display");
  theme.value = "";
  themeDisplay.textContent = "";
  updateTheme(theme.value);

  // wayof
  const wayof = document.getElementById("wayof");
  const wayofDisplay = document.getElementById("wayof-display");
  wayof.value = "";
  wayofDisplay.textContent = "";
  updateWayof(wayof.value);

  // type
  const type = document.getElementById("type");
  type.value = "";
  const typeDisplay = document.getElementById("type-display");
  typeDisplay.textContent = type.value;
  updateType(type.value);

  // Players
  const players = document.getElementById("players");
  players.value = "";
  const playersDisplay = document.getElementById("players-display");
  playersDisplay.textContent = players.value;
  updatePlayers(players.value);
})
// =====

// Type =====
type.addEventListener("change", () => {
  const typeDisplay = document.getElementById("type-display");
  typeDisplay.textContent = type.value != "" ? "Impro. " + type.value : "";
  updateType(type.value);
})

function getType()
{
  return localStorage.getItem("type");
}

function updateType(type) 
{
  localStorage.setItem("type", type);
  window.electronAPI.sendTypeUpdate(type);
}
// ======

// Players =====
players.addEventListener("change", () => {
  const playersDisplay = document.getElementById("players-display");
  playersDisplay.textContent = players.value != "" ? "nb de joueurs : " + players.value : "";
  updatePlayers(players.value);
})

function getPlayers()
{
  return localStorage.getItem("players");
}

function updatePlayers(players) 
{
  localStorage.setItem("players", players);
  window.electronAPI.sendPlayersUpdate(players);
}
// =====

// Confetti stuff=====
function getConfettiParam()
{
  return localStorage.getItem("confetti");
}

function triggerFirework() 
{
  window.electronAPI.sendTriggerFirework();
}
// =====

// Open display button =====
openBtn.addEventListener('click', () => {
  window.electronAPI.openDisplay();
})
