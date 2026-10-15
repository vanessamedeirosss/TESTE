const page = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.site-nav .nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === page) link.classList.add('active');
});

const progress = document.createElement('div');
progress.className = 'reading-progress';
document.body.appendChild(progress);

window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
  progress.style.width = `${pct}%`;
});

const button = document.createElement('button');
button.id = 'btnTopo';
button.setAttribute('aria-label', 'Voltar ao topo');
button.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
document.body.appendChild(button);

window.addEventListener('scroll', () => {
  button.style.display = window.scrollY > 450 ? 'block' : 'none';
});

button.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// As âncoras são tratadas pelo navegador para preservar a URL, o histórico
// e os links diretos às referências. A rolagem suave é definida no CSS.

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => {
    el.classList.add('reveal-ready');
    observer.observe(el);
  });
} else {
  // Fallback: em navegadores sem IntersectionObserver, o conteúdo permanece visível.
  revealElements.forEach(el => el.classList.add('visible'));
}

const year = document.getElementById('ano');
if (year) year.textContent = new Date().getFullYear();


/* Acessibilidade: controles globais */
(() => {
  "use strict";
  const root = document.documentElement;
  const fontSteps = [87.5, 100, 112.5, 125, 137.5, 150];
  const readSaved = (key) => {
    try { return localStorage.getItem(key); }
    catch (_) { return null; }
  };
  const save = (key, value) => {
    try { localStorage.setItem(key, String(value)); }
    catch (_) { /* Navegação privada: controles continuam ativos nesta página. */ }
  };

  let font = Number(readSaved("hmrm-font-size"));
  if (!fontSteps.includes(font)) font = 100;
  let dark = readSaved("hmrm-theme") === "dark";
  root.style.fontSize = font + "%";
  root.dataset.theme = dark ? "dark" : "light";

  const widget = document.createElement("div");
  widget.className = "a11y-widget";
  widget.innerHTML = [
    '<button class="a11y-toggle" type="button" id="a11y-open" aria-expanded="false" aria-controls="a11y-panel" aria-label="Abrir ferramentas de acessibilidade">',
      '<i class="fa-solid fa-universal-access" aria-hidden="true"></i> Acessibilidade',
    '</button>',
    '<section class="a11y-panel" id="a11y-panel" aria-labelledby="a11y-title" hidden>',
      '<div class="a11y-panel-header">',
        '<h2 id="a11y-title">Acessibilidade</h2>',
        '<button type="button" class="a11y-control a11y-close" id="a11y-close" aria-label="Fechar ferramentas de acessibilidade">×</button>',
      '</div>',
      '<div class="a11y-group">',
        '<p class="a11y-group-label">Tamanho do texto</p>',
        '<div class="a11y-controls" role="group" aria-label="Ajustar tamanho da fonte">',
          '<button type="button" class="a11y-control" id="a11y-smaller" aria-label="Diminuir tamanho da fonte">A−</button>',
          '<button type="button" class="a11y-control" id="a11y-reset" aria-label="Restaurar tamanho original da fonte">Padrão</button>',
          '<button type="button" class="a11y-control" id="a11y-larger" aria-label="Aumentar tamanho da fonte">A+</button>',
        '</div>',
      '</div>',
      '<div class="a11y-group">',
        '<p class="a11y-group-label">Aparência</p>',
        '<div class="a11y-controls">',
          '<button type="button" class="a11y-control" id="a11y-theme" aria-pressed="false">',
            '<i class="fa-solid fa-moon" aria-hidden="true"></i><span id="a11y-theme-text">Tema escuro</span>',
          '</button>',
        '</div>',
      '</div>',
      '<div class="a11y-group">',
        '<p class="a11y-group-label">Leitura em voz alta</p>',
        '<div class="a11y-controls a11y-read-controls" role="group" aria-label="Controlar a leitura de texto">',
          '<button type="button" class="a11y-control" id="a11y-read">',
            '<i class="fa-solid fa-volume-high" aria-hidden="true"></i> Ler texto',
          '</button>',
          '<button type="button" class="a11y-control" id="a11y-pause" disabled>',
            '<i class="fa-solid fa-pause" aria-hidden="true"></i><span id="a11y-pause-label">Pausar</span>',
          '</button>',
          '<button type="button" class="a11y-control" id="a11y-stop" disabled>',
            '<i class="fa-solid fa-stop" aria-hidden="true"></i> Parar',
          '</button>',
        '</div>',
        '<p class="a11y-hint">Selecione um trecho para ouvi-lo. Sem seleção, a leitura percorre o conteúdo desta página. A voz depende do navegador e do dispositivo.</p>',
      '</div>',
      '<p class="a11y-status" id="a11y-status" role="status" aria-live="polite"></p>',
    '</section>'
  ].join("");
  document.body.appendChild(widget);

  const $ = (id) => widget.querySelector("#" + id);
  const openButton = $("a11y-open");
  const panel = $("a11y-panel");
  const status = $("a11y-status");
  const smaller = $("a11y-smaller");
  const larger = $("a11y-larger");
  const reset = $("a11y-reset");
  const themeButton = $("a11y-theme");
  const themeText = $("a11y-theme-text");
  const readButton = $("a11y-read");
  const pauseButton = $("a11y-pause");
  const pauseLabel = $("a11y-pause-label");
  const stopButton = $("a11y-stop");
  const supportsSpeech = typeof window.speechSynthesis !== "undefined" &&
    typeof window.SpeechSynthesisUtterance === "function";
  const synth = supportsSpeech ? window.speechSynthesis : null;

  function inform(message) { status.textContent = message; }
  function updateFont() {
    root.style.fontSize = font + "%";
    smaller.disabled = font === fontSteps[0];
    larger.disabled = font === fontSteps[fontSteps.length - 1];
    reset.disabled = font === 100;
  }
  function changeFont(direction) {
    const index = fontSteps.indexOf(font);
    const next = Math.max(0, Math.min(fontSteps.length - 1, index + direction));
    font = fontSteps[next];
    save("hmrm-font-size", font);
    updateFont();
    inform("Tamanho de fonte: " + font + "%.");
  }
  function updateTheme() {
    root.dataset.theme = dark ? "dark" : "light";
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.setAttribute("aria-label", dark ? "Desativar tema escuro" : "Ativar tema escuro");
    themeText.textContent = dark ? "Tema claro" : "Tema escuro";
    const icon = themeButton.querySelector("i");
    icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
  function togglePanel(show, restoreFocus = false) {
    panel.hidden = !show;
    openButton.setAttribute("aria-expanded", String(show));
    openButton.setAttribute("aria-label", show ? "Fechar ferramentas de acessibilidade" : "Abrir ferramentas de acessibilidade");
    if (show) smaller.focus();
    if (!show && restoreFocus) openButton.focus();
  }

  smaller.addEventListener("click", () => changeFont(-1));
  larger.addEventListener("click", () => changeFont(1));
  reset.addEventListener("click", () => {
    font = 100;
    save("hmrm-font-size", font);
    updateFont();
    inform("Tamanho padrão restaurado.");
  });
  themeButton.addEventListener("click", () => {
    dark = !dark;
    save("hmrm-theme", dark ? "dark" : "light");
    updateTheme();
    inform(dark ? "Tema escuro ativado." : "Tema claro ativado.");
  });
  openButton.addEventListener("click", () => togglePanel(panel.hidden, !panel.hidden));
  $("a11y-close").addEventListener("click", () => togglePanel(false, true));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) togglePanel(false, true);
  });
  document.addEventListener("pointerdown", (event) => {
    if (!panel.hidden && !widget.contains(event.target)) togglePanel(false);
  });

  let generation = 0;
  let queue = [];
  let nextIndex = 0;
  let playing = false;
  let paused = false;
  function updateSpeechControls() {
    pauseButton.disabled = !supportsSpeech || !playing;
    stopButton.disabled = !supportsSpeech || !playing;
    pauseLabel.textContent = paused ? "Continuar" : "Pausar";
    pauseButton.setAttribute("aria-label", paused ? "Continuar leitura" : "Pausar leitura");
    readButton.disabled = !supportsSpeech;
  }
  function stopSpeech(silent = false) {
    generation += 1;
    queue = [];
    nextIndex = 0;
    playing = false;
    paused = false;
    if (synth) synth.cancel();
    updateSpeechControls();
    if (!silent) inform("Leitura interrompida.");
  }
  function splitSpeech(text) {
    const sentences = text.replace(/\s+/g, " ").trim().match(/[^.!?]+[.!?]*/g) || [];
    const parts = [];
    let current = "";
    for (const sentence of sentences) {
      for (const word of sentence.trim().split(/\s+/)) {
        if (current && (current.length + 1 + word.length > 220)) {
          parts.push(current);
          current = "";
        }
        current += (current ? " " : "") + word;
      }
    }
    if (current) parts.push(current);
    return parts;
  }
  function readChunk(token) {
    if (token !== generation || !playing) return;
    if (nextIndex >= queue.length) {
      playing = false;
      paused = false;
      updateSpeechControls();
      inform("Leitura concluída.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(queue[nextIndex]);
    utterance.lang = "pt-BR";
    utterance.rate = 0.93;
    const voices = synth.getVoices();
    const voice = voices.find(v => v.lang.toLowerCase() === "pt-br") ||
      voices.find(v => v.lang.toLowerCase().startsWith("pt"));
    if (voice) utterance.voice = voice;
    utterance.onend = () => {
      if (token !== generation) return;
      nextIndex += 1;
      readChunk(token);
    };
    utterance.onerror = (event) => {
      if (token !== generation) return;
      playing = false;
      paused = false;
      updateSpeechControls();
      inform("Não foi possível continuar a leitura (" + (event.error || "erro do navegador") + ").");
    };
    synth.speak(utterance);
  }
  readButton.addEventListener("click", () => {
    if (!supportsSpeech) return;
    const chosen = (window.getSelection()?.toString() || "").trim();
    const heading = document.querySelector("header h1")?.innerText || document.title;
    const mainText = document.querySelector("main")?.innerText || "";
    const source = chosen || (heading + ". " + mainText);
    const parts = splitSpeech(source);
    if (!parts.length) { inform("Não há texto disponível para leitura."); return; }
    stopSpeech(true);
    queue = parts;
    nextIndex = 0;
    playing = true;
    paused = false;
    const token = generation;
    updateSpeechControls();
    inform(chosen ? "Lendo o trecho selecionado." : "Lendo o conteúdo da página.");
    readChunk(token);
  });
  pauseButton.addEventListener("click", () => {
    if (!playing || !synth) return;
    if (paused) {
      synth.resume();
      paused = false;
      inform("Leitura retomada.");
    } else {
      synth.pause();
      paused = true;
      inform("Leitura pausada.");
    }
    updateSpeechControls();
  });
  stopButton.addEventListener("click", () => stopSpeech());
  window.addEventListener("pagehide", () => { if (playing) stopSpeech(true); });

  updateFont();
  updateTheme();
  updateSpeechControls();
  if (!supportsSpeech) inform("A leitura em voz alta não está disponível neste navegador.");
})();

