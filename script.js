"use strict";
const display = document.querySelector(".icons");
let displayCollomns = [];
const renderGame = function () {
  for (let i = 0; i <= 4; i++) {
    displayCollomns += `<div class="sm-collumn">
    <img class="nowin nowin--0" src="img/TNT1.png" /><img
      class="win"
      src="img/13.png"
    /><img class="nowin nowin--5" src="img/TNT1.png" />
  </div>`;
  }

  display.innerHTML = displayCollomns;
};

renderGame();
const run = document.querySelector(".run");

const nowins = document.querySelectorAll(".nowin");
const wins = document.querySelectorAll(".win");

const bet = document.querySelector(".bet-value");
const credit = document.querySelector(".credit-value");
const moneyWon = document.querySelector(".money-won");

const addBtn = document.querySelector(".plus");
const takeBtn = document.querySelector(".minus");
const inputValue = document.querySelector(".add-take-value");

let winLine = [];
let winQ = 0;

let betValue = 0.5;
let creditValue = 100;

//random nr. between [0,max]
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//random nr between [min,max]
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//count how many times winLine includes a number
function countWinLine(n) {
  let count = 0;
  for (var i = 0; i < winLine.length; i++) {
    if (winLine[i] === n) {
      count++;
    }
  }
  return count;
}

//Determine winQ
const determineWinQ = function () {
  //7
  for (let i = 2; i <= 5; i++) {
    if (countWinLine(0) == i) {
      winQ = winQ + 20 * i;
    }
    for (let j = 1; j <= 3; j++) {
      if ((countWinLine(0) == i) & (countWinLine(j) == i)) {
        winQ = winQ + 5 * i;
      }
    }

    for (let j = 5; j <= 13; j++)
      if (countWinLine(0) == i && countWinLine(j) == i) {
        winQ = winQ + 3 * i;
      }
  }

  //specials
  for (let i = 2; i <= 5; i++) {
    for (let j = 1; j <= 3; j++) {
      if (countWinLine(j) == i) {
        winQ = winQ + i * 2;
      }
    }
  }
  for (let i = 2; i <= 5; i++) {
    if (countWinLine(4) == i) {
      winQ = winQ + i;
    }
  }

  //fruits
  //same 3 or more
  for (let i = 3; i <= 5; i++) {
    for (let j = 5; j <= 13; j++)
      if (countWinLine(j) == i) {
        winQ = winQ + i * 1.5;
      }
  }
  // same 2 and same 2
  let validDouble = 0;
  for (let i = 5; i <= 13; i++) {
    if (countWinLine(i) == 2) {
      validDouble = 1;
      console.log(winLine);
      for (let j = 5; j <= 13; j++) {
        if (countWinLine(j) == 2 && validDouble == 1 && j !== i) {
          winQ = winQ + 1.5;
          validDouble = 0;
        }
      }
    }
  }

  if (winQ <= 3 && winQ > 0) {
    playSound("sounds/smallwin.mp3");
  } else if (winQ > 3 && winQ <= 10) {
    playSound("sounds/mediumwin.mp3");
  } else if (winQ > 10) {
    playSound("sounds/bigwin.mp3");
  }
};

const playSound = function (name) {
  new Audio(name).play();
};

//SPIN
run.addEventListener("click", function () {
  playSound("sounds/spin.mp3");
  //nowin
  winLine = [];
  winQ = 0;

  for (let i = 0; i <= 9; i++) {
    const randomNr = Math.trunc(Math.random() * 100);
    if (randomNr <= 20 && randomNr > 10) {
      nowins[i].src = `img/4.png`;
    } else if (randomNr <= 10 && randomNr > 2.5) {
      nowins[i].src = `img/${Math.trunc(getRandomArbitrary(1, 4))}.png`;
    } else if (randomNr <= 2.5) {
      nowins[i].src = `img/0.png`;
    } else {
      nowins[i].src = `img/${Math.trunc(getRandomArbitrary(5, 14))}.png`;
    }
  }

  //win
  for (let i = 0; i < 5; i++) {
    wins[i].style.calc = "calc(0)";
    const randomNr = Math.trunc(Math.random() * 100);
    if (randomNr <= 20 && randomNr > 5) {
      wins[i].src = `img/4.png`;
      winLine.push(4);
    } else if (randomNr <= 5 && randomNr > 2) {
      const x = Math.trunc(getRandomArbitrary(1, 4));
      wins[i].src = `img/${x}.png`;
      winLine.push(x);
    } else if (randomNr <= 1) {
      wins[i].src = `img/0.png`;
      winLine.push(0);
    } else {
      const x = Math.trunc(getRandomArbitrary(5, 14));
      wins[i].src = `img/${x}.png`;
      winLine.push(x);
    }
  }

  console.log(winLine);
  determineWinQ();
  moneyWon.innerHTML = `x${winQ}`;
  console.log(winQ);

  if (betValue <= creditValue) {
    creditValue = creditValue - betValue + betValue * winQ;
    credit.innerHTML = creditValue;
  } else {
    alert("You dont have enough money");
  }
});

//ADD BET
addBtn.addEventListener("click", function () {
  playSound("sounds/addbet.mp3");
  betValue = betValue + Number(inputValue.value);
  bet.innerHTML = betValue;
});

takeBtn.addEventListener("click", function () {
  if (betValue - Number(inputValue.value) > 0) {
    playSound("sounds/takebet.mp3");
    betValue = betValue - Number(inputValue.value);
    bet.innerHTML = betValue;
  } else {
    alert("You cannot bet negative values");
  }
});
