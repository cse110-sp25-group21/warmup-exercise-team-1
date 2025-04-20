//Player balance
let balance = Number(document.getElementById("player-balance").textContent);

// Card Definitions
const suits = ["♣", "♠", "♥", "♦"];
const values = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

// Flip listener for every card
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => {
    if (card.classList.contains("flipped")) {
      card.classList.remove("flipped");
    } else {
      document
        .querySelectorAll(".card")
        .forEach((c) => c.classList.remove("flipped"));
      card.classList.add("flipped");
    }
  });
});

// hit listener (deals another card)
document.getElementById("hit").onclick = function () {
  const deltCard = getRandomCard(currentDeck);
  player.push(deltCard);
  renderCard(deltCard, "player-hand");

  if (calcHandValue(player) > 21) {
    alert("You busted! Dealer wins.");
    document.getElementById("hit").disabled = true;
    document.getElementById("place-bet+").disabled = false;
  }
};

//stand listener
document.getElementById("stand").onclick = function () {
  document.getElementById("hit").disabled = true;
  document.getElementById("stand").disabled = true;
  dealerActions();
};

// Reset listener
document.getElementById("rest-btn").onclick = function () {
  resetBoard();
  alert("reset");
};

// Place Bet listener
document.getElementById("place-bet+").addEventListener("click", () => {
  if (!placeBet()) return;
  document.getElementById("place-bet+").disabled = true;
  document.getElementById("hit").disabled = false;
  document.getElementById("stand").disabled = false;
});

function placeBet() {
  let betInput = document.getElementById("bet-input");
  const amt = Number(betInput.value);
  if (amt > balance) {
    alert("Invalid Bet");
    return false;
  }

  currentBet = amt;
  balance -= amt;
  document.getElementById("player-balance").textContent = balance.toString(); //update balance

  startGame();
  return true;
}

/**
 * Creates starting deck with all cards
 * @return full deck
 */
function createDeck() {
  deck = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({ value, suit });
    });
  });

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

/**
 * Deals one random card and removes it from deck
 * @return Dealed card
 */
function getRandomCard(deck) {
  let i = Math.floor(Math.random() * deck.length);
  let randCard = deck[i];
  deck.splice(i, 1);
  return randCard;
}

function renderCard(card, hand) {
  const cardElement = document.createElement("div");
  cardElement.className = "card";

  const faceSide = document.createElement("div");
  faceSide.className = "face";
  faceSide.textContent = `${card.value} ${card.suit}`;

  const backSide = document.createElement("div");
  backSide.className = "back";
  backSide.textContent = "SeekDeep v2.0";

  cardElement.appendChild(faceSide);
  cardElement.appendChild(backSide);

  cardElement.addEventListener("click", () => {
    cardElement.classList.toggle("flipped");
  });

  document.getElementById(hand).appendChild(cardElement);
}

/**
 * Creates deck and deals player and dealer cards
 * @return void
 */
function startGame() {
  player = [];
  dealer = [];
  handVal = 0;
  document.getElementById("player-hand").replaceChildren();
  document.getElementById("dealer-hand").replaceChildren();
  currentDeck = createDeck();
  document.getElementById("place-bet+").disabled = false;

  for (let i = 0; i < 4; i++) {
    const temp = getRandomCard(currentDeck);
    if (i < 2) {
      player.push(temp);
      renderCard(temp, "player-hand");
    } else {
      dealer.push(temp);
      renderCard(temp, "dealer-hand");
    }
  }

  if (calcHandValue(player) == 21) {
    alert("Blackjack! You win!");
    balance += currentBet * 2.5; // Blackjack pays 3:2
    document.getElementById("player-balance").textContent = balance.toString();
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
    document.getElementById("place-bet+").disabled = false;
  }

  if (calcHandValue(dealer) == 21) {
    alert("Dealer has Blackjack! You lose.");
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
    document.getElementById("place-bet+").disabled = false;
  }
}

/**
 * Calculates value of hand for Blackjack.
 * @param user, so if you want to calc the dealer's hand,
 * you can pass dealer as argument and it will take the dealer's array
 * @return value of hand
 */
function calcHandValue(user) {
  handVal = 0;
  hasAce = false;
  for (let i = 0; i < user.length; i++) {
    if (user[i].value == "J" || user[i].value == "Q" || user[i].value == "K") {
      handVal += 10;
    } else if (user[i].value == "A") {
      // Allow player to choose 1 or 11? for now it is 11 if they are not over 10, and 1 if they are
      hasAce = true;
    } else {
      handVal += parseInt(user[i].value);
    }
  }
  if (hasAce && handVal + 11 > 21) {
    handVal += 1; // If adding 11 would bust, count Ace as 1
  } else if (hasAce) {
    handVal += 11;
  }
  return handVal;
}

/**
 * Dealer actions based on Blackjack rules
 * @return void
 * If dealer's hand is less than 17, they continue to hit (draw a card) until they reach 17 or more
 * If dealer's hand is over 21, they bust
 * If dealer's hand is between 17 and 21, they stand (stop drawing cards)
 * After dealer actions, the hands are compared to determine the winner
 * If player has higher hand value than dealer, player wins and gets double their bet
 * If dealer has higher hand value than player, dealer wins and player loses their bet
 * If both hands are equal, it is a tie and the player's bet is returned
 */
function dealerActions() {
  dealerBusted = false;
  while (calcHandValue(dealer) < 17) {
    const deltCard = getRandomCard(currentDeck);
    dealer.push(deltCard);
    renderCard(deltCard, "dealer-hand");

    if (calcHandValue(dealer) > 21) {
      dealerBusted = true;
      break;
    }
    if (calcHandValue(dealer) > 16 && calcHandValue(dealer) <= 21) {
      break;
    }
  }

  // Compare hands after dealer actions
  if ((calcHandValue(player) > calcHandValue(dealer) && calcHandValue(player) <= 21) || calcHandValue(dealer) > 21) {
    balance += currentBet * 2; //player wins, adds double their bet
    if (dealerBusted == true) {
      alert("Dealer busted! You win!");
    } else {
      alert("You win!");
    }
    document.getElementById("player-balance").textContent = balance.toString(); //update balance display
  } else if ((calcHandValue(player) < calcHandValue(dealer) && calcHandValue(dealer) <= 21) || calcHandValue(player) > 21) {
    balance; //dealer wins, player loses bet amount, which was already subtracted from balance
    document.getElementById("player-balance").textContent = balance.toString(); //update balance
    alert("Dealer wins");
  } else {
    balance += currentBet; //return the bet if there is a tie
    document.getElementById("player-balance").textContent = balance.toString(); //update balance display
    alert("Tie");
  }
  document.getElementById("place-bet+").disabled = false;
}

/**
 * remove dealt cards and create deck, need to add in animation?
 */
function resetBoard() {
  //reset balance
  balance = 1000; //reset to starting balance
  document.getElementById("player-balance").textContent = balance.toString();
  document.getElementById("stand").disabled = false;
  document.getElementById("hit").disabled = false;
  document.getElementById("place-bet+").disabled = false;
  document.getElementById("bet-input").value = ""; //reset bet input
}
