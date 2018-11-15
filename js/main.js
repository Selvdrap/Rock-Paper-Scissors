const d = document;
const templates = [...d.querySelectorAll('template')];
const questionTemplate = d.querySelector('#question');
const opponentLinks = d.querySelector('.player__options--player');
const arenaPlayer = d.querySelector('.arena__player');
const sides = [...d.querySelectorAll('.arena__default')];
opponentLinks.addEventListener('click', opponentLinksEventHandler, false);

sides.forEach(side => {
  let clonedTemplate = questionTemplate.content.cloneNode(true);
  side.appendChild(clonedTemplate);
});

function opponentLinksEventHandler(e) {
  if(e.target !== e.currentTarget) {
    const type = getChoice(e);
    setChosenPicture(type);
  }
  e.stopPropagation();
  e.preventDefault();
}

function getChoice(e) {
  let choice = e.target.getAttribute('data-player-choice');
  return choice;
}

function setChosenPicture(type) {
  for(let i = 0; i < templates.length; i++) {
    if(templates[i].id === type) {
      let clonedTemplate = templates[i].content.cloneNode(true);
      if(arenaPlayer.hasChildNodes()) {
        // arenaPlayer.removeChild(arenaPlayer.firstChild);
        arenaPlayer.innerHTML = '';
      } 
      arenaPlayer.appendChild(clonedTemplate);

      break;
    }
  }
}