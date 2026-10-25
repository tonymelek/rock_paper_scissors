import {
  MOVES,
  computerMove,
  moveById,
  outcome,
  resultSentence,
} from "./game.js";

const STORAGE_KEY = "rps-scores";

const resultEl = document.querySelector("#result");
const round = document.querySelector("#round");
const rulesDialog = document.querySelector("#rules-dialog");
const rulesOpen = document.querySelector("#rules-open");
const playerImg = document.querySelector("#player-choice");
const computerImg = document.querySelector("#computer-choice");
const playerScoreEl = document.querySelector("#player-score");
const computerScoreEl = document.querySelector("#computer-score");
const resetButton = document.querySelector("#reset");
const installButton = document.querySelector("#install");

const NEUTRAL_MOVE = "rock";

const scores = loadScores();
let roundToken = 0;

if (!resultEl || !document.querySelector(".moves") || !resetButton) {
  throw new Error("Rock Paper Scissors: page markup is missing required elements.");
}

renderScores();
showNeutralBoard();

document.querySelector(".moves").addEventListener("click", (event) => {
  const button = event.target.closest("[data-move]");
  if (!button) return;
  play(button.dataset.move);
});

resetButton.addEventListener("click", reset);

if (rulesOpen && rulesDialog) {
  rulesOpen.addEventListener("click", () => rulesDialog.showModal());
}

document.addEventListener("keydown", (event) => {
  if (rulesDialog?.open) return;
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  const key = event.key.toLowerCase();
  const move = MOVES.find((item) => item.key === key);
  if (!move) return;
  event.preventDefault();
  play(move.id);
});

let deferredPrompt = null;

if (installButton) {
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
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).catch(() => {
    // file:// and some private modes refuse a worker. The page still plays.
  });
}

function play(playerId) {
  if (!moveById(playerId)) return;
  roundToken += 1;
  const computerId = computerMove();
  const result = outcome(playerId, computerId);
  if (result === "win") scores.player += 1;
  if (result === "lose") scores.computer += 1;
  saveScores();
  resultEl.textContent = resultSentence(playerId, computerId);
  resultEl.dataset.outcome = result;
  round.classList.remove("board--idle");
  showMove(playerImg, playerId, "You played");
  showMove(computerImg, computerId, "Computer played");
  renderScores();
}

function reset() {
  scores.player = 0;
  scores.computer = 0;
  localStorage.removeItem(STORAGE_KEY);
  resultEl.textContent = "";
  delete resultEl.dataset.outcome;
  showNeutralBoard();
  renderScores();
}

function showNeutralBoard() {
  round.classList.add("board--idle");
  setMoveImage(playerImg, NEUTRAL_MOVE);
  setMoveImage(computerImg, NEUTRAL_MOVE);
  playerImg.alt = "Pick a move below";
  computerImg.alt = "Computer ready";
}

function showMove(image, id, prefix) {
  const move = moveById(id);
  image.alt = `${prefix} ${move.label}`;
  setMoveImage(image, move.id);
}

function setMoveImage(image, id) {
  image.src = `./images/${id}.png?r=${roundToken}`;
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
