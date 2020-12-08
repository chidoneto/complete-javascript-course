'use strict';

// console.log(document.querySelector('.message').textContent);

// document.querySelector('.message').textContent = 'Correct number!!';

// document.querySelector('.number').textContent = 13;
// document.querySelector('.score').textContent = 10;

// document.querySelector('.guess').value = 23;

let secretNumber, score;
let highScore = 0;

const setMessage = (msg) => {
  document.querySelector('.message').textContent = msg;
};

const reset = () => {
  secretNumber = Math.floor(Math.random() * 20) + 1;
  document.querySelector('.number').textContent = '?';
  score = 20;
  document.querySelector('.score').textContent = score;
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.guess').value = '';
  setMessage('Start guessing...');
};

const iWin = () => {
  setMessage('Correct number!!');
  document.querySelector('body').style.backgroundColor = '#60b347';
  document.querySelector('.number').style.width = '30rem';
  document.querySelector('.number').textContent = secretNumber;
  if (score > highScore) {
    highScore = score;
    document.querySelector('.highscore').textContent = highScore;
  }
};

const onCheckClick = (e) => {
  const guess = Number(document.querySelector('.guess').value);
  console.log(guess);
  if (!guess) {
    setMessage('❌ No number!');
    return;
  }
  if (score <= 0) return;

  if (secretNumber === guess) {
    iWin();
  } else if (secretNumber < guess) {
    setMessage('Too high!!');
    document.querySelector('.score').textContent = --score;
  } else if (secretNumber > guess) {
    setMessage('Too low!!');
    document.querySelector('.score').textContent = --score;
  }
  if (score < 1) {
    setMessage('❌ You loose!');
  }
};

reset();

document.querySelector('.check').addEventListener('click', onCheckClick);
document.querySelector('.again').addEventListener('click', reset);
