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

// Deal listener
document.getElementById("deal-btn").onclick = function() {
  alert("deal");
}

// Reset listener
document.getElementById("rest-btn").onclick = function() {
  resetBoard();
  alert("reset");
}


// Card Definitions
const suits = ['♣', '♠', '♥', '♦'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

/**
 * Creates starting deck with all cards
 * @return full deck
 */
function createDeck() {
  deck = [];
  suits.forEach(suit => {
    values.forEach(value => {
      deck.push({value, suit});
    });
  });
  return deck;
}

/**
 * Deals one random card and removes it from deck
 * @return Dealed card 
 */
function getRandomCard(deck){
  let i = Math.floor(Math.random() * deck.length);
  let randCard = deck[i];
  deck.splice(i, 1);
  return randCard;
}
/**
 * Creates deck and deals player and dealer cards
 * @return void
 */
function startGame(){
  player = [];
  dealer = [];

  currentDeck = createDeck();
  player.push(getRandomCard(currentDeck));
  player.push(getRandomCard(currentDeck));
  dealer.push(getRandomCard(currentDeck));
  dealer.push(getRandomCard(currentDeck));
  
}

/**
 * Calculates value of hand for Blackjack. 
 * @param user, so if you want to calc the dealer's hand, 
 * you can pass dealer as argument and it will take the dealer's array
 * @return value of hand
 */
function calcHandValue(user){
  for(let i = 0; i < user.length; i++){
    if(user[i].value == 'J' || user[i].value == 'Q' || user[i].value == 'K'){
      handVal += 10;
    }
    else if(user[i].value == 'A'){
      // Allow player to choose 1 or 11? for now it is 11 if they are not over 10, and 1 if they are
      if(handVal <= 10){ 
        handVal += 11
      } else {
        handVal += 1;
      }
    }
    else{
      handVal += parseInt(user[i].value);
    }
  }
  return handVal;
}

/**
 * remove dealt cards and create deck, need to add in animation? 
 */
function resetBoard(){
  player = [];
  dealer = [];
  currentDeck = createDeck();
}