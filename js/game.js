export const MOVES = [
  { id: "rock", label: "Rock", beats: "scissors", key: "r" },
  { id: "paper", label: "Paper", beats: "rock", key: "p" },
  { id: "scissors", label: "Scissors", beats: "paper", key: "s" },
];

const byId = new Map(MOVES.map((move) => [move.id, move]));

export function moveById(id) {
  return byId.get(id) ?? null;
}

export function outcome(player, computer) {
  const playerMove = byId.get(player);
  const opponent = byId.get(computer);
  if (!playerMove || !opponent) {
    throw new Error(`Unknown move: ${player} vs ${computer}`);
  }
  if (player === computer) return "tie";
  return playerMove.beats === computer ? "win" : "lose";
}

export function computerMove(random = Math.random) {
  const index = Math.min(
    MOVES.length - 1,
    Math.floor(random() * MOVES.length),
  );
  return MOVES[index].id;
}

export function resultSentence(player, computer) {
  const result = outcome(player, computer);
  const playerLabel = byId.get(player).label;
  const computerLabel = byId.get(computer).label;
  if (result === "tie") return `Tie. You both picked ${playerLabel}.`;
  if (result === "win") return `You win. ${beats(playerLabel, computerLabel)}`;
  return `You lose. ${beats(computerLabel, playerLabel)}`;
}

function beats(winner, loser) {
  const verb = winner === "Scissors" ? "beat" : "beats";
  return `${winner} ${verb} ${loser}.`;
}
