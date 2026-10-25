import assert from "node:assert/strict";
import { test } from "node:test";
import { computerMove, moveById, outcome, resultSentence } from "./game.js";

const matchups = [
  ["rock", "scissors", "win"],
  ["rock", "paper", "lose"],
  ["rock", "rock", "tie"],
  ["paper", "rock", "win"],
  ["paper", "scissors", "lose"],
  ["paper", "paper", "tie"],
  ["scissors", "paper", "win"],
  ["scissors", "rock", "lose"],
  ["scissors", "scissors", "tie"],
];

test("all nine matchups", () => {
  for (const [player, computer, expected] of matchups) {
    assert.equal(outcome(player, computer), expected);
  }
});

test("result sentences name both moves", () => {
  assert.equal(resultSentence("rock", "scissors"), "You win. Rock beats Scissors.");
  assert.equal(resultSentence("rock", "paper"), "You lose. Paper beats Rock.");
  assert.equal(resultSentence("paper", "paper"), "Tie. You both picked Paper.");
  assert.equal(resultSentence("scissors", "paper"), "You win. Scissors beat Paper.");
  assert.equal(resultSentence("paper", "scissors"), "You lose. Scissors beat Paper.");
});

test("computerMove stays inside the three moves", () => {
  assert.equal(computerMove(() => 0), "rock");
  assert.equal(computerMove(() => 0.34), "paper");
  assert.equal(computerMove(() => 0.67), "scissors");
  assert.equal(computerMove(() => 0.999), "scissors");
});

test("unknown moves are rejected", () => {
  assert.equal(moveById("lizard"), null);
  assert.throws(() => outcome("rock", "lizard"));
  assert.throws(() => outcome("lizard", "rock"));
});
