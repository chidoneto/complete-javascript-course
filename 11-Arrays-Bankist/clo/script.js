'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

let accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
let sorted = false;

/////////////////////////////////////////////////


const displayMovements = (movements, sorted = false) => {
  containerMovements.innerHTML = '';
  movements = (sorted) ? movements.slice().sort((a, b) => +a - +b) : movements;

  movements.forEach((mov, i) => {
    const type = (mov > 0) ? 'deposit' : 'withdrawal';
    const html = `        
      <div class="movements__row">  
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    // <div class="movements__date">3 days ago</div>
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calDisplayBalance = account => {
  const movements = account.movements;
  account.balance = movements.reduce((acc, mov) => acc += mov, 0);
  labelBalance.textContent = `${account.balance}€`;
};

const calcDisplaySummary = account => {
  const movements = account.movements;
  const interestRate = account.interestRate / 100;

  const income = movements.filter(mov => mov > 0).reduce((acc, amt) => acc += amt, 0);
  const outcome = movements.filter(mov => mov < 0).reduce((acc, amt) => acc += amt, 0);
  const interest = movements.filter(mov => mov > 0).filter(inc => inc * interestRate > 1).reduce((acc, amt) => acc += amt / 100, 0);

  labelSumIn.textContent = `${income}€`;
  labelSumOut.textContent = `${Math.abs(outcome)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

////------------
const createUsernames = function (accs) {
  accs.forEach(acc => acc.username = acc.owner.split(' ').map(name => name[0]).join('').toLowerCase());
};

createUsernames(accounts);

let currentAccount;
const onLogin = e => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  } else {

  }
}

const updateUI = account => {
  displayMovements(account.movements, sorted);
  calDisplayBalance(account);
  calcDisplaySummary(account);
}

const onBtnTransfer = e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 && amount <= currentAccount.balance &&
    receiverAccount?.username !== currentAccount.username) {
    // console.log("TOK");
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    updateUI(currentAccount);
  }
}

const closeAccount = e => {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => (acc.username === currentAccount.username));
    if (index >= 0) {
      accounts.splice(index, 1);
      containerApp.style.opacity = 0;
    }
  }
  inputCloseUsername.value = inputClosePin.value = '';
};

const applyLoan = e => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
};


btnLogin.addEventListener('click', onLogin);
btnTransfer.addEventListener('click', onBtnTransfer);
btnClose.addEventListener('click', closeAccount);
btnLoan.addEventListener('click', applyLoan);
btnSort.addEventListener('click', () => { sorted = !sorted; updateUI(currentAccount) });

let deposits = movements.filter(mov => mov > 0);
let withdrawls = movements.filter(mov => mov < 0);

let balance = movements.reduce((tot, amt) => (tot += amt), 0);
balance = [...deposits, ...withdrawls].reduce((tot, amt) => (tot += amt), 0);
