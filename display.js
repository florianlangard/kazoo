import 'bootstrap/dist/css/bootstrap.min.css';
import 'notyf/notyf.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./display.css";

import 'bootstrap';

const teamBlue = document.getElementById('team-blue');
const teamRed = document.getElementById('team-red');

const teamBlueScore = document.getElementById('team-blue-score-display');
const teamRedScore = document.getElementById('team-red-score-display');

const theme = document.getElementById("theme");

const wayof = document.getElementById("wayof");

const type = document.getElementById("type");

const players = document.getElementById("players");

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
  document.getElementById("type").textContent = window.electronAPI.getType();
  document.getElementById("players").textContent = window.electronAPI.getPlayers();
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

function updateTeamScore(teamColor, score) {
  if (teamColor == "blue") {
    teamBlueScore.textContent = score;
  }
  else {
    teamRedScore.textContent = score;
  }
}

function updateTheme(text) {
  theme.textContent = text;
}

function updateWayof(text) {
  wayof.textContent = text ? "A la manière de : " + text : "";
}

function updateType(text) {
  type.textContent = text;
}

function updatePlayers(text) {
  players.textContent = text;
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

window.electronAPI.onScoreUpdate((teamColor, teamName) => {
  updateTeamScore(teamColor, teamName);
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