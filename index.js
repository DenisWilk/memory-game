
const lightThemeBtn = document.querySelector('.btn1');
const blueThemeBtn = document.querySelector('.btn2');
const darkThemeBtn = document.querySelector('.btn3');
const themeClasses = document.querySelectorAll('body, .scores-table, .score-titles')

let levelLable = 'E';
let difficultyLevel = 6;
const easyLevel = document.querySelector('.game1');
const normalLevel = document.querySelector('.game2');
const hardLevel = document.querySelector('.game3');

const newGame = document.querySelector('.new-game');
const newPlayer = document.querySelector('.new-player');
const player = document.querySelector('.player');
player.value = '';
let playerName;

const displayCount = document.querySelector('.counter');
const textComplit = document.querySelector('.text-complit');
let stepsCount = 0;
displayCount.innerHTML = 0;

const cardsContainer = document.querySelector('.cards-container');
const cards = document.querySelectorAll('.card');
const cardsNomalLvl = document.querySelectorAll('.normal-level');
const cardsHardLvl = document.querySelectorAll('.hard-level');
let isRotatedCard = false;
let isLockCard = false;
let firstCard;
let secondCard;
let bingo = 0;
let bingoLevel = 6;

const highScoreList = document.getElementById("high-scores");
const lastScoreList = document.getElementById("last-scores");
const numberOfHighScores = 10;
const numberOfLastScores = 10;
const highScores = 'highScores';
const lastScores = 'lastScores';
const dataHighScores = JSON.parse(localStorage.getItem(highScores)) ?? [];
const dataLastScores = JSON.parse(localStorage.getItem(lastScores)) ?? [];
const eraseHighScoreBtn = document.querySelector('.erase-high');
const eraseLastScoreBtn = document.querySelector('.erase-last');



function setEasyLevel() {

    resetGame();
    removeTemplateClasses();

    cardsContainer.classList.remove('cards-container-extended');
    cardsNomalLvl.forEach(el => el.classList.add('normal-level'));
    cardsHardLvl.forEach(el => el.classList.add('hard-level'));
    levelLable = 'E';
    difficultyLevel = 6;
    bingoLevel = 6;
    localStorage.setItem('level', 'easy'); 
}


function setNormalLevel() {

    resetGame();
    removeTemplateClasses();

    cardsContainer.classList.remove('cards-container-extended');
    cardsNomalLvl.forEach(el => el.classList.remove('normal-level'));
    cardsHardLvl.forEach(el => el.classList.add('hard-level'));
    levelLable = 'N';
    difficultyLevel = 8;
    bingoLevel = 8;
    localStorage.setItem('level', 'normal');   
}

function setHardLevel() {

    resetGame();
    removeTemplateClasses();

    cardsContainer.classList.add('cards-container-extended');
    cardsNomalLvl.forEach(el => el.classList.remove('normal-level'));
    cardsHardLvl.forEach(el => el.classList.remove('hard-level'));
    levelLable = 'H';
    difficultyLevel = 10;
    bingoLevel = 10;
    localStorage.setItem('level', 'hard'); 
}
easyLevel.addEventListener('click', setEasyLevel);
normalLevel.addEventListener('click', setNormalLevel);
hardLevel.addEventListener('click', setHardLevel);



function checkHighScore(score) {

    const lowestScore = dataHighScores[numberOfHighScores - 1]?.score ?? 0;
    if (score < lowestScore || lowestScore === 0) {
        saveHighScore(score, dataHighScores);
        showHighScores();
    }
}



function saveLastScore(score, dataLastScores) {

    const newScore = { score, playerName };

    dataLastScores.unshift(newScore);
    dataLastScores.splice(numberOfLastScores);
    localStorage.setItem(lastScores, JSON.stringify(dataLastScores));

    if (dataLastScores.length > 10) {
        dataLastScores.pop(newScore);
    }
}



function saveHighScore(score, dataHighScores) {

    const newScore = { score, playerName };

    dataHighScores.push(newScore);
    dataHighScores.sort((a, b) => a.score - b.score);
    dataHighScores.splice(numberOfHighScores);
    localStorage.setItem(highScores, JSON.stringify(dataHighScores));
}



function eraseHighScore() {

    highScoreList.innerHTML = '';
    window.localStorage.removeItem(highScores);
    location.reload();
}
eraseHighScoreBtn.addEventListener('click', eraseHighScore);



function eraseLastScore() {

    lastScoreList.innerHTML = '';
    localStorage.removeItem(lastScores);
    location.reload();
}
eraseLastScoreBtn.addEventListener('click', eraseLastScore);



function showHighScores() {

    highScoreList.innerHTML = dataHighScores
        .map((score) => `<li>${score.score} - ${score.playerName}</li>`)
        .join('');
}
showHighScores();



function showLastScores() {

    lastScoreList.innerHTML = dataLastScores
        .map((score) => `<li>${score.score} - ${score.playerName}</li>`)
        .join('');
}
showLastScores();



function resetPlayerName() {

    player.value = '';
    player.focus();
}
newPlayer.addEventListener('click', resetPlayerName);



function resetCounters() {

    textComplit.innerHTML = '';
    displayCount.innerHTML = 0;
    stepsCount = 0;
    bingo = 0;
}

function resetGame() {

    cards.forEach(card => {
        card.classList.remove('card-rotate');
    });

    cards.forEach(card => {
        card.classList.add('template-no-rotate');
    });

    cards.forEach(card => {
        card.classList.add('reset-color');
    });

    cards.forEach(card => {
        card.addEventListener('click', rotateCard);
    });

    resetCounters();
    resetCards();
    /* makeCardsRandom(); */

    if (player.value === '') player.focus();
}
newGame.addEventListener('click', resetGame);



function removeTemplateClasses() {

    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('template-no-rotate');
            card.classList.remove('reset-color');
        })
    }, 150);
}
newGame.addEventListener('click', removeTemplateClasses);



function rotateCard() {

    playerName = `${player.value} (${levelLable})`;

    if (isLockCard) return;
    if (this === firstCard) return;

    this.classList.add('card-rotate');
    stepsCount = stepsCount + 1;
    displayCount.innerHTML = `${levelLable} ${stepsCount}`;

    if (!isRotatedCard) {
        isRotatedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    displayCount.innerHTML = `${levelLable} ${stepsCount}`;

    checkForMatch();
}
cards.forEach(el => el.addEventListener('click', rotateCard));



function checkForMatch() {

    let isMatch = (firstCard.dataset.img === secondCard.dataset.img)
    isMatch ? keepCardsOpen() : unRotateCard();
}



function keepCardsOpen() {

    firstCard.removeEventListener('click', rotateCard);
    secondCard.removeEventListener('click', rotateCard);
    bingo = bingo + 1;

    resetCards();

    if (bingo === bingoLevel) {
        textComplit.innerHTML = `Game complit! Your score: ${stepsCount}`;

        checkHighScore(stepsCount);
        showHighScores();
        saveLastScore(stepsCount, dataLastScores);
        showLastScores();
    }
}



function unRotateCard() {

    isLockCard = true;

    setTimeout(() => {
        firstCard.classList.remove('card-rotate');
        secondCard.classList.remove('card-rotate');

        resetCards();
    }, 1000);
}



function resetCards() {

    [isRotatedCard, isLockCard] = [false, false];
    [firstCard, secondCard] = [null, null];
}


/* function makeCardsRandom() {

    cards.forEach(card => {
        let cardPosition = Math.floor(Math.random() * 20);
        card.style.order = cardPosition;
    });
}
makeCardsRandom(); */



function loadLightTheme() {

    localStorage.setItem('theme', 'light');
    themeClasses.forEach((el) => { el.classList.remove('blue') });
    themeClasses.forEach((el) => { el.classList.remove('dark') });
}

function loadBlueTheme() {

    localStorage.setItem('theme', 'blue');
    themeClasses.forEach((el) => { el.classList.add('blue') });
    themeClasses.forEach((el) => { el.classList.remove('dark') });
}

function loadDarkTheme() {

    localStorage.setItem('theme', 'dark');
    themeClasses.forEach((el) => { el.classList.add('dark') });
    themeClasses.forEach((el) => { el.classList.remove('blue') });
}
lightThemeBtn.addEventListener('click', loadLightTheme);
blueThemeBtn.addEventListener('click', loadBlueTheme);
darkThemeBtn.addEventListener('click', loadDarkTheme);


function getThemeLocalStorage() {

    let savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') loadLightTheme();
    if (savedTheme === 'blue') loadBlueTheme();
    if (savedTheme === 'dark') loadDarkTheme();
}
window.addEventListener('load', getThemeLocalStorage);


function getLevelLocalStorage() {
    
    let savedLevel = localStorage.getItem('level');

    if (savedLevel === 'easy') setEasyLevel();
    if (savedLevel === 'normal') setNormalLevel();
    if (savedLevel === 'hard') setHardLevel();
}
window.addEventListener('load', getLevelLocalStorage);


