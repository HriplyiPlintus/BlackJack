
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'],
  values = [
  'Ace', 'King', 'Queen', 'Jack',
  'Ten', 'Nine', 'Eight', 'Seven', 'Six',
  'Five', 'Four', 'Three', 'Two'
];

//DOM variables
let textArea = document.getElementById('text-area'),
hitButton = document.getElementById('hit-button'),
newGameButton = document.getElementById('new-game-button'),
stayButton = document.getElementById('stay-button');

//Game variables
let gameStarted = false,
  gameOver = false,
  playerWon = false,
  dealerCards = [],
  playerCards = [],
  dealerScore = 0, 
  playerScore = 0,
  deck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', function(){
  gameStarted = true;
  gameOver = false;
  playerWon = false;

  deck = createDeck();
  shuffleDeck();

  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  newGameButton.style.display = 'none';
  stayButton.style.display = 'inline';
  hitButton.style.display = 'inline';
  showStatus();
});

function createDeck(){
  let deck = [];
  for(let valueIdx = 0; valueIdx < values.length; valueIdx++){
    for(let suitIdx = 0; suitIdx < suits.length; suitIdx++){
      let card = {
        suit: suits[suitIdx], 
        value: values[valueIdx],
        toString: function toString(){
          return this.value + ' of ' + this.suit;
        }
      };
      deck.push(card);
    }
  }
  return deck;
}

function getNextCard(){
  
  return deck.shift();
}

function shuffleDeck(){  
  let tmpInx = 0;
  let tmpCard = null,
    card = null;
  for(let i = 0; i < deck.length; i++){
    tmpInx = Math.floor(Math.random() * 52);
    tmpCard = deck[tmpInx];   //temp card in index tmpInx
    card = deck[i];
    deck[i] = tmpCard;
    deck[tmpInx] = card;
  }
}

function showStatus(){
  if(!gameStarted){
    textArea.innerText = 'Welcome to Blackjeck!';
    return;
  }

  textArea.innerText = "Dealer's cards:\n" +
    playersHandString(dealerCards) +
    "Score: " + getHandScore(dealerCards) +
    "\n\n" +
    "Player's cards:\n" + 
    playersHandString(playerCards) +
    "Score: " + getHandScore(playerCards) +
    "\n";

  if(gameOver){
    let won = "";
    if(playerWon){
      won = "!!!PLAYER WON!!!";
    }
    else{
      won = "!!!DEALER WON!!!";
    }
    textArea.innerText += "\n" + won;

    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
  }

}

function playersHandString(hand){
  let result = '';
  for(let i = 0; i < hand.length; i++){
    result += hand[i].toString() + '\n';
  }
  return result;
}

function getCardNumericValue(card){
  switch(card.value){
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Fore':
      return 4;
    case 'Five':
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10;
  }
}

function getHandScore(hand){
  let result = 0;
  let hasAce = false;
  let card = null;
  for(let i = 0; i < hand.length; i++){
    card = hand[i];
    result += getCardNumericValue(card);
  }
  if(card.value === 'Ace')
    hasAce = true;
    
  if(hasAce && result + 10 <= 21){
    return result;
  }
  return result;
}

hitButton.addEventListener('click', function(){
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

stayButton.addEventListener('click', function(){
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

function checkForEndOfGame(){
  updateScores();
  if(gameOver){
    //let dealer take cards
    while(dealerScore < playerScore 
          && playerScore <= 21
          && dealerScore <= 21){
      dealerCards.push(getNextCard());
      updateScores();
    }
  }

  if(playerScore > 21){
    playerWon = false;
    gameOver = true;
  }
  else if(dealerScore > 21){
    playerWon = true;
    gameOver = true;
  }
  else if(gameOver){
    if(playerScore > dealerScore){
      playerWon = true;
    }
    else{
      playerWon = false;
    }
  }
}

function updateScores(){
  dealerScore = getHandScore(dealerCards);
  playerScore = getHandScore(playerCards);
}
