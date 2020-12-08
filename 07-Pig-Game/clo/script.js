'use strict';

const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

class side {
  constructor(idx, score = 0, current = 0) {
    this.score = score;
    this.current = current;
    this.scoreEl = document.getElementById(`score--${idx}`);
    this.currentEl = document.getElementById(`current--${idx}`);
    this.nameEl = document.getElementById(`name--${idx}`);
    this.playerEl = document.getElementById(`player--${idx}`);
    console.log(this.playerEl);
  }
};

const PLAYER1 = 0;
const PLAYER2 = 1;
const sides = [new side(PLAYER1), new side(PLAYER2)];
let currentPlayer = PLAYER1;

const reset = () => {
  sides.forEach((side, idx) => {
    side.score = 0;
    side.current = 0;
    side.scoreEl.textContent = side.score;
    side.currentEl.textContent = side.current;
    side.nameEl.textContent = `Player ${idx + 1}`;
  });
  diceEl.classList.add('hidden');
  btnRoll.classList.remove('hidden');
  btnHold.classList.remove('hidden');
  currentPlayer = PLAYER1;
  switchPlayer();
  switchPlayer();
};

const switchPlayer = () => {
  sides[currentPlayer].playerEl.classList.remove('player--active');
  currentPlayer = (currentPlayer === PLAYER1) ? PLAYER2 : PLAYER1;
  sides[currentPlayer].playerEl.classList.add('player--active');
};

const rollDice = () => {
  const diceRoll = Math.floor(Math.random() * 6) + 1;
  diceEl.src = `dice-${diceRoll}.png`;
  if (diceRoll === 1) {
    sides[currentPlayer].current = 0;
    sides[currentPlayer].currentEl.textContent = 0;
    switchPlayer();
  } else {
    sides[currentPlayer].current += diceRoll;
    sides[currentPlayer].currentEl.textContent = sides[currentPlayer].current;
  }
  diceEl.classList.remove('hidden');
};

const iWin = () => {
  diceEl.classList.add('hidden');
  btnRoll.classList.add('hidden');
  btnHold.classList.add('hidden');
  sides[currentPlayer].nameEl.textContent = `Player ${currentPlayer + 1} Winner!!`;
  sides[currentPlayer].playerEl.classList.remove('player--active');
  sides[currentPlayer].playerEl.classList.add('player--winner');
};

const holdScore = () => {
  sides[currentPlayer].score += sides[currentPlayer].current;
  sides[currentPlayer].scoreEl.textContent = sides[currentPlayer].score;
  sides[currentPlayer].current = 0;
  sides[currentPlayer].currentEl.textContent = 0;
  if (sides[currentPlayer].score >= 100) {
    iWin();
  } else {
    switchPlayer();
  }
};

reset();

btnNew.addEventListener('click', reset);
btnRoll.addEventListener('click', rollDice);
btnHold.addEventListener('click', holdScore);
