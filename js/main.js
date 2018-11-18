const d = document;
const options = ['rock', 'paper', 'scissors'];
const templates = [...d.querySelectorAll('template')];
const questionTemplate = d.querySelector('#question');
const playerOptions = d.querySelector('.player__options--player');
const playerLinks = [...d.querySelectorAll('.player__choice')];
const arenaPlayer = d.querySelector('.arena__player');
const arenaOpponent = d.querySelector('.arena__opponent');
const sides = [...d.querySelectorAll('.arena__default')];
const play = d.querySelector('.arena__button');
const stars = [...d.querySelectorAll('.fa-star')];
const humanStars = [...d.querySelectorAll('.points__player--human .fa-star')];
const computerStars = [...d.querySelectorAll('.points__player--computer .fa-star')];
const players = [
  {type: 'Human', choice: null, wins: 0, stars: humanStars, img: arenaPlayer}, 
  {type: 'Computer', choice: null, wins: 0, stars: computerStars, img: arenaOpponent}
];
let map = {};

options.forEach((opt, i) => {
  map[opt] = {};
  map[opt][opt] = 0;
  map[opt][options[(i + 1) % options.length]] = -1;
  map[opt][options[(i + 2) % options.length]] = 1;
});

playerOptions.addEventListener('click', playerOptionsClickHandler, false);
play.addEventListener('click', playClickHandler, false);

// START ROUND
resetChoices();

function playClickHandler() {
  if(players[0].choice != null) {
    setComputerChoice();
    makeTurn();
  }
}

function playerOptionsClickHandler(e) {
  if(e.target !== e.currentTarget) {
    setChoice(e.target);
  }
  e.stopPropagation();
  e.preventDefault();
}

function cloneTemplate(player) {
  for(let i = 0; i < templates.length; i++) {
    if(templates[i].id === player.choice) {
      let clonedTemplate = templates[i].content.cloneNode(true);
      if(player.img.hasChildNodes()) {
        // player.img.removeChild(player.firstChild);
        player.img.innerHTML = '';
      } 
      player.img.appendChild(clonedTemplate);

      break;
    }
  }
}

function getChoice(data) {
  let choice = data.getAttribute('data-player-choice');
  
  return choice;
}

function setChoice(ch) {
  const type = getChoice(ch);
  players[0].choice = type;
  cloneTemplate(players[0]); 
}

function randomFromArray(arr) {
  function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }
  let temp = arr.slice();  

  return shuffle(temp)[Math.floor(Math.random() * arr.length)];
}

function setComputerChoice() {
  players[1].choice = randomFromArray(options);
  cloneTemplate(players[1]);  
}

function compareChoices(ch1, ch2) {
  if(ch1 != null && ch2 != null) {
    return map[ch1][ch2];
  }
  throw new Error('Invalid choice');
}

function makeTurn() {
  const result = compareChoices(players[0].choice, players[1].choice);
  if(result == null) {
    throw new Error('Invalid arguments');
  } 

  if(result === 0) {
    setTimeout(resetChoices, 500);
  } else if(result === 1) {
    addWinPoint(players[0]);
    animateChoice(players[0].img, players[1].img);
    setTimeout(resetChoices, 2500);
  }  else if(result === -1) {
    addWinPoint(players[1]);
    animateChoice(players[1].img, players[0].img);
    setTimeout(resetChoices, 2500);
  }
}

function animateChoice(winner, looser) {
  winner.classList.add('zoomIn');
  looser.classList.add('swing');
  playerLinks.forEach(link => link.style.pointerEvents = 'none');
  play.style.pointerEvents = 'none';
  setTimeout(function() {
    winner.classList.remove('zoomIn');
    looser.classList.remove('swing');
  }, 2000);
}

function addWinPoint(player) {
  if(player.wins < 3) {
    player.wins++;
    addStar(player.stars, player.wins);
  }
  if(player.wins === 3) announceWinner(player);
}

function addStar(items, count) {
  for(let i = 0; i < count; i++) {
    items[i].classList.add('checked');
  }
}

function announceWinner(pl) {
  setTimeout(function() {
    alert(`${pl.type} won!`);
    resetGame();
  }, 1000);
}

function resetChoices() {
  players.forEach(pl => pl.choice = null);
  sides.forEach(s => s.innerHTML = '');
  sides.forEach(side => {
    let clonedTemplate = questionTemplate.content.cloneNode(true);
    side.appendChild(clonedTemplate);
  });
  playerLinks.forEach(link => link.style.pointerEvents = 'auto');
  play.style.pointerEvents = 'auto';
}

function resetWins() {
  resetChoices();
  players.forEach(pl => pl.wins = 0);
  stars.forEach(st => st.classList.remove('checked'));
}

function resetGame() {
  resetWins();
}
