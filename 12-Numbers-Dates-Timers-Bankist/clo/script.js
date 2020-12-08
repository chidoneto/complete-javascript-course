'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-11-16T17:01:17.194Z',
    '2020-11-20T23:36:17.929Z',
    '2020-11-22T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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
// My Functions
// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// let accounts = [account1, account2, account3, account4];

// Elements
// const labelWelcome = document.querySelector('.welcome');
// const labelDate = document.querySelector('.date');
// const labelBalance = document.querySelector('.balance__value');
// const labelSumIn = document.querySelector('.summary__value--in');
// const labelSumOut = document.querySelector('.summary__value--out');
// const labelSumInterest = document.querySelector('.summary__value--interest');
// const labelTimer = document.querySelector('.timer');

// const containerApp = document.querySelector('.app');
// const containerMovements = document.querySelector('.movements');

// const btnLogin = document.querySelector('.login__btn');
// const btnTransfer = document.querySelector('.form__btn--transfer');
// const btnLoan = document.querySelector('.form__btn--loan');
// const btnClose = document.querySelector('.form__btn--close');
// const btnSort = document.querySelector('.btn--sort');

// const inputLoginUsername = document.querySelector('.login__input--user');
// const inputLoginPin = document.querySelector('.login__input--pin');
// const inputTransferTo = document.querySelector('.form__input--to');
// const inputTransferAmount = document.querySelector('.form__input--amount');
// const inputLoanAmount = document.querySelector('.form__input--loan-amount');
// const inputCloseUsername = document.querySelector('.form__input--user');
// const inputClosePin = document.querySelector('.form__input--pin');

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

const formatDate = (date, dateOnly = false) => {
  const locale = navigator.language; // --or-- currentAccount.locale
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  if (!dateOnly) options.hour = options.minute = 'numeric';

  return new Intl.DateTimeFormat(locale, options).format(date);

  // const day = `${date.getDate()}`.padStart(2, '0');
  // const month = `${date.getMonth() + 1}`.padStart(2, ' ');
  // const year = date.getFullYear();
  // const hour = `${date.getHours()}`.padStart(2, ' ');
  // const min = `${date.getMinutes()}`.padStart(2, '0');
  // const time = (dateOnly) ? '' : `, ${hour}:${min}`;
  // return `${month}/${day}/${year}${time}`;
}

const relativeDate = date => {
  let delta = +(new Date()) - +date;
  delta /= 24 * 60 * 60 * 1000;
  delta = Math.floor(delta);

  if (delta === 0) return 'Today';
  if (delta === 1) return 'Yesterday';
  if (delta === 7) return 'One Week Ago';
  if (delta < 7) return `${delta} Days Ago`;
  return formatDate(date, true);
}

const formatAmount = (amount, locale, currency) => {
  const options = { style: 'currency', currency };

  return new Intl.NumberFormat(locale, options).format(amount);
};

const displayMovements = (accnt, sorted = false) => {
  let movements = accnt.movements;

  containerMovements.innerHTML = '';
  movements = (sorted) ? movements.slice().sort((a, b) => +a - +b) : movements;

  movements.forEach((mov, i) => {
    const type = (mov > 0) ? 'deposit' : 'withdrawal';
    const html = `        
      <div class="movements__row">  
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${relativeDate(new Date(accnt.movementsDates[i]))}</div>
        <div class="movements__value">${formatAmount(mov, accnt.locale, accnt.currency)}</div>
      </div>
    `;
    // <div class="movements__date">3 days ago</div>
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = account => {
  const movements = account.movements;
  account.balance = movements.reduce((acc, mov) => acc += mov, 0);
  labelBalance.textContent = `${formatAmount(account.balance, account.locale, account.currency)}`;
};

const calcDisplaySummary = account => {
  const movements = account.movements;
  const interestRate = account.interestRate / 100;

  const income = movements.filter(mov => mov > 0).reduce((acc, amt) => acc += amt, 0);
  const outcome = movements.filter(mov => mov < 0).reduce((acc, amt) => acc += amt, 0);
  const interest = movements.filter(mov => mov > 0).filter(inc => inc * interestRate > 1).reduce((acc, amt) => acc += amt / 100, 0);

  labelSumIn.textContent = `${formatAmount(income, account.locale, account.currency)}`;
  labelSumOut.textContent = `${formatAmount(Math.abs(outcome), account.locale, account.currency)}`;
  labelSumInterest.textContent = `${formatAmount(interest, account.locale, account.currency)}`;
};

let timer = null;

const startLogoutTimer = (secs) => {
  timer && clearTimeout(timer);

  const displayTimeLeft = () => {
    const ss = secs % 60;
    const mm = (secs-- - ss) / 60;

    labelTimer.textContent = `${mm}:${('' + ss).padStart(2, '0')}`;

    if (secs <= 0) {
      doLogout();
      clearTimeout(timer);
    }
  };
  timer = setInterval(displayTimeLeft, 1000);
};

////------------
let currentAccount;

const createUsernames = accnts => {
  accnts.forEach(acc => acc.username = acc.owner.split(' ').map(name => name[0]).join('').toLowerCase());
};

createUsernames(accounts);

const onLogin = e => {
  e.preventDefault();
  const accnt = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(accnt);

  console.log(`${accnt?.pin}:${inputLoginPin.value}`);
  if (accnt?.pin === Number(inputLoginPin.value)) {
    doLogin(accnt);
  } else {
    // login failed => error message
  }
}

const updateUI = account => {
  displayMovements(account, sorted);
  calcDisplayBalance(account);
  calcDisplaySummary(account);

  labelDate.textContent = formatDate(new Date());
}

const doLogin = accnt => {
  currentAccount = accnt;
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
  containerApp.style.opacity = 100;

  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

  inputCloseUsername.value = inputClosePin.value = '';

  startLogoutTimer(300);

  updateUI(currentAccount);
};

const doLogout = () => {
  labelWelcome.textContent = `Log in to get started`;
  containerApp.style.opacity = 0;
};

// doLogin(account2); // OJO -- Debug only!!

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

    currentAccount.movementsDates.push(new Date());
    receiverAccount.movementsDates.push(new Date());

    startLogoutTimer(300);
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
  startLogoutTimer(300);
};

const applyLoan = e => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date());
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
  startLogoutTimer(300);
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
