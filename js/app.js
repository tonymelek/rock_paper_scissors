import {
  MOVES,
  computerMove,
  moveById,
  outcome,
  resultSentence,
} from "./game.js";

const STORAGE_KEY = "rps-scores";

const resultEl = document.querySelector("#result");
const roundStatus = document.querySelector("#round-status");
const round = document.querySelector("#round");
const playerImg = document.querySelector("#player-choice");
const computerImg = document.querySelector("#computer-choice");
const playerScoreEl = document.querySelector("#player-score");
const computerScoreEl = document.querySelector("#computer-score");
const resetButton = document.querySelector("#reset");
const installButton = document.querySelector("#install");

const scores = loadScores();
renderScores();

document.querySelector(".moves").addEventListener("click", (event) => {
  const button = event.target.closest("[data-move]");
  if (!button) return;
  play(button.dataset.move);
});

resetButton.addEventListener("click", reset);

document.addEventListener("keydown", (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  const key = event.key.toLowerCase();
  const move = MOVES.find((item) => item.key === key);
  if (!move) return;
  event.preventDefault();
  play(move.id);
});

let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installButton.hidden = true;
});

window.addEventListener("appinstalled", () => {
  installButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).catch(() => {
    // file:// and some private modes refuse a worker. The page still plays.
  });
}

function play(playerId) {
  if (!moveById(playerId)) return;
  const computerId = computerMove();
  const result = outcome(playerId, computerId);
  if (result === "win") scores.player += 1;
  if (result === "lose") scores.computer += 1;
  saveScores();
  resultEl.textContent = resultSentence(playerId, computerId);
  resultEl.dataset.outcome = result;
  showMove(playerImg, playerId, "You played");
  showMove(computerImg, computerId, "Computer played");
  round.hidden = false;
  roundStatus.hidden = true;
  renderScores();
}

function reset() {
  scores.player = 0;
  scores.computer = 0;
  localStorage.removeItem(STORAGE_KEY);
  resultEl.textContent = "Pick a move.";
  delete resultEl.dataset.outcome;
  round.hidden = true;
  roundStatus.hidden = false;
  playerImg.removeAttribute("src");
  computerImg.removeAttribute("src");
  playerImg.alt = "";
  computerImg.alt = "";
  renderScores();
}

function showMove(image, id, prefix) {
  const move = moveById(id);
  image.src = `./images/${move.id}.png`;
  image.alt = `${prefix} ${move.label}`;
}

function renderScores() {
  playerScoreEl.textContent = String(scores.player);
  computerScoreEl.textContent = String(scores.computer);
}

function loadScores() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "");
    const player = Number(parsed.player);
    const computer = Number(parsed.computer);
    if (
      Number.isInteger(player) &&
      Number.isInteger(computer) &&
      player >= 0 &&
      computer >= 0
    ) {
      return { player, computer };
    }
  } catch {
    // A missing or broken value starts a fresh session.
  }
  return { player: 0, computer: 0 };
}

function saveScores() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}
