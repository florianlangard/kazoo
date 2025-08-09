import { translations } from './translations.js';
import confetti from 'canvas-confetti';
import 'notyf/notyf.min.css';
import { Notyf } from 'notyf';

const notyf = new Notyf({
  duration: 2000,
});

const owner = 'florianlangard';
const repo = 'kazoo';

const langSelector = document.getElementById("langSelector");
const savedLang = localStorage.getItem("lang") || "en";
langSelector.value = savedLang;

const downloadButton = document.getElementById('downloadBtn');
const title = document.querySelector('h1');

// EventListeners
downloadButton.addEventListener('click', triggerConfetti);
title.addEventListener('click', triggerConfetti);

langSelector.addEventListener("change", (e) => {
  setLanguage(e.target.value);
  toggleLangNotice();
});

// version handling
async function getLatestRelease() {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
    if (!response.ok) {
      notyf.error('Impossible de récupérer la dernière version.');
      throw new Error(`GitHub API error: ${response.status}`)
    };

    const data = await response.json();
    const version = data.tag_name;
    
    const exeAsset = data.assets.find(asset => asset.name.endsWith('.exe'));
    if (!exeAsset) throw new Error('Aucun fichier .exe trouvé dans la release.');

    document.getElementById('appVersion').textContent = `Version: ${version}`;
    
    document.getElementById('downloadBtn').addEventListener('click', () => {
      window.location.href = exeAsset.browser_download_url;
      notyf.success(`Téléchargement de la ${version} lancé !`);
    });
  } catch (err) {
    console.error(err);
    notyf.error('Impossible de récupérer la dernière version.');
  }
}

// Language handling
function setLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[lang][key] || key;
  });
  localStorage.setItem("lang", lang);
}

function toggleLangNotice() {
  if (localStorage.getItem('lang') === "en") {
    let element = document.createElement('p');
    element.className = "lang-notice";
    let parent = document.querySelector('.description')
    element.textContent = "This app is only avilable in French for now.";
    parent.appendChild(element);
  }
  else {
    let element = document.querySelector('.lang-notice');
    if (element) {
      element.remove();
    }
  }
}

// confetti =====
function triggerConfetti() 
{
    function frame() {
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 50,
      origin: { x: 1 },
      colors: ["#fff", "#b11414"],
    });
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 50,
      origin: { x: 0 },
      colors: ["#fff", "#00f"],
    });
  }
  frame();
}


// functions calls
document.addEventListener('DOMContentLoaded', () => {
  toggleLangNotice();
  setLanguage(savedLang);
  getLatestRelease();
});
