const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',
{
  // Teams =====
  sendTeamUpdate: (teamColor, teamName) => {
    ipcRenderer.send("update-team", teamColor, teamName);
  },
  onTeamUpdate: (callback) => {
    ipcRenderer.on('team-updated', (_, teamColor, teamName) => {
      callback(teamColor, teamName);
    });
  },

  // Scores =====
  sendScoreUpdate: (teamColor, score) => {
    ipcRenderer.send("update-score", teamColor, score);
  },
  onScoreUpdate: (callback) => {
    ipcRenderer.on('score-updated', (_, teamColor, score) => {
      callback(teamColor, score);
    });
  },

  // Theme =====
  sendThemeUpdate: (theme) => {
    ipcRenderer.send("update-theme", theme);
  },
  onThemeUpdate: (callback) => {
    ipcRenderer.on('theme-updated', (_, theme) => {
      callback(theme);
    });
  },

  //  Way of =====
  sendWayofUpdate: (wayof) => {
    ipcRenderer.send("update-wayof", wayof);
  },
  onWayofUpdate: (callback) => {
    ipcRenderer.on('wayof-updated', (_, wayof) => {
      callback(wayof);
    });
  },

  // Type =====
  sendTypeUpdate: (type) => {
    ipcRenderer.send("update-type", type);
  },
  onTypeUpdate: (callback) => {
    ipcRenderer.on('type-updated', (_, type) => {
      callback(type);
    });
  },

  // Players =====
  sendPlayersUpdate: (players) => {
    ipcRenderer.send("update-players", players);
  },
  onPlayersUpdate: (callback) => {
    ipcRenderer.on('players-updated', (_, players) => {
      callback(players);
    });
  },

  // Timers =====
  sendTimerSet: (timer, timeInSec) => {
    ipcRenderer.send("timer-set", timer, timeInSec);
  },
  onTimerSet: (callback) => {
    ipcRenderer.on('timer-setted', (_, timer, timeInSec) => {
      callback(timer, timeInSec);
    });
  },
  sendTimerUpdate: (timerKey, time) => ipcRenderer.send("timer-update", timerKey, time),
  onTimerUpdate: (callback) => ipcRenderer.on("timer-update", (_, timer, timeInSec) => callback(timer, timeInSec)),

  sendFoulUpdate: (team, count) => ipcRenderer.send("foul-update", team, count),
  onFoulUpdate: (callback) => ipcRenderer.on("foul-update", (_, team, count) => callback(team, count)),


  sendReset: () => ipcRenderer.send("app-reset"),
  onAppReset: (callback) => ipcRenderer.on("app-reset-notify", callback),
  

  // Getters for display.js =====
  getTeamName: (team) => localStorage.getItem(`team-${team}`),
  getScore: (team) => parseInt(localStorage.getItem(`${team}-score`)) || 0,
  getTimer: (timerKey) => parseInt(localStorage.getItem(`${timerKey}-timer`)) || 0,
  getFouls: (team) => parseInt(localStorage.getItem(`${team}-fouls`)) || 0,
  getTheme: () => localStorage.getItem("theme") || "",
  getWayof: () => localStorage.getItem("wayof") || "",
  getType: () => localStorage.getItem("type") || "",
  getPlayers: () => localStorage.getItem("players") || "",
  
  openDisplay: () => {
    ipcRenderer.send('open-display');
},
})