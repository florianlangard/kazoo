import confetti from 'canvas-confetti';
import 'notyf/notyf.min.css';

import { Notyf } from 'notyf';

console.log('main.js');

const notyf = new Notyf({
  duration: 2000,
});

const owner = 'florianlangard';
const repo = 'kazoo';

let downloadButton = document.getElementById('downloadBtn');
let title = document.querySelector('h1');

downloadButton.addEventListener('click', triggerConfetti);
title.addEventListener('click', triggerConfetti);

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

// getLatestRelease();

// confetti =====
function triggerConfetti() 
{
    function frame() {
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 50,
      origin: { x: 1 },
      colors: ["#fff", "#0000ff"],
    });
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 50,
      origin: { x: 0 },
      colors: ["#fff", "#b11414"],
    });
  }
  frame();
}
