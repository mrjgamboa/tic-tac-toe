'use strict';

const display = (() => {

    const homeDiv = document.querySelector('#home');
    const settingDiv = document.querySelector('#setting');
    const boardDiv = document.querySelector('#board');
    const resultDiv = document.querySelector('#matchResultContainer');
    const gameMenuDiv = document.querySelector('#gameMenu');
    const closeMenuBtn = document.querySelector('.close-menu-button');

    const _hideHome = () => homeDiv.classList.add('hide');
    const _showHome = () => homeDiv.classList.remove('hide');
    const _showSetting = () => settingDiv.classList.add('show');
    const _hideSetting = () => settingDiv.classList.remove('show');
    const _showBoard = () => boardDiv.classList.add('show');
    const _hideBoard = () => boardDiv.classList.remove('show');
    const _showResultDiv = () => resultDiv.classList.add('show');
    const _hideResultDiv = () => resultDiv.classList.remove('show');
    const _showGameMenuDiv = () => gameMenuDiv.classList.add('show');
    const _hideGameMenuDiv = () => gameMenuDiv.classList.remove('show');
    const _showCloseMenuBtn = () => closeMenuBtn.classList.add('show');
    const _hideCloseMenuBtn = () => closeMenuBtn.classList.remove('show');

    const resultMessage = document.querySelector('[data-match-result-text]');

    const playIsClicked = () => {
        _hideHome();
        _showSetting();
    };

    const modeIsSelected = () => {
        _hideSetting();
        _showBoard();
        _showGameMenuDiv();
    };

    const matchEnded = (msg) => {
        _hideGameMenuDiv();
        _hideCloseMenuBtn();
        _showResultDiv();
        resultMessage.innerText = msg;
    };

    const restartGame = () => {
        _hideResultDiv();
        _showGameMenuDiv();
    };

    const backToHome = () => {
        _hideBoard();
        _showHome();
        _hideGameMenuDiv();
    };

    const menuIsClicked = () => {
        resultMessage.innerText = '';
        _hideGameMenuDiv();
        if(!closeMenuBtn.classList.contains('show')) _showCloseMenuBtn();
        _showResultDiv();
    };

    const closeMenu = () => {
        _hideCloseMenuBtn();
        _hideResultDiv();
        _showGameMenuDiv();
    };

    const exit = () => window.close();

    return { 
        playIsClicked, modeIsSelected, matchEnded, restartGame, 
        backToHome, exit, menuIsClicked, closeMenu
    }

})();

const Player = (name, mark) => {

    let tiles = [];
    
    const info = function(){
        console.log(`Hello, I'm ${name}! I use the power of ${mark}.
        I have "${this.tiles}".`);
    };

    return {
        name, mark, tiles, info
    }
};

const generateNumber = function(){
    const tilesDivCollection = document.querySelectorAll('[data-tile]');
    let array = [];
    tilesDivCollection.forEach(function(tile){
        if(!tile.classList.contains('x') && !tile.classList.contains('o')){
            array.push(tile.dataset.tile)
        }
    });
    if(array.length) 
    return array[Math.floor(Math.random() * array.length)];
}

const game = (() => {

    let mode;
    let players = [];
    let marker;
    let message = false;
    const WINNING_COMBINATION = [
        [1,2,3],
        [4,5,6],
        [7,8,9],
        [1,4,7],
        [2,5,8],
        [3,6,9],
        [1,5,9],
        [3,5,7]
    ];

    const boardDiv = document.querySelector('#board');
    const tilesDivCollection = document.querySelectorAll('.board [data-tile]');

    const _computerIndex = () => {
        let index = 0;
        let computerIndex;
        players.forEach(function(players){
            if(players.name == 'Computer'){
                computerIndex = index;
            }
            index++;
        });
        return computerIndex;
    };


    const _isTurn = () => 
        players[0].mark == marker ? players[0].name : players[1].name;


    const _recordPlayerTiles = function(){
        let player = _isTurn();
        const _isPlayer = (element) => element.name == player;
        let index = players.findIndex(_isPlayer);

        let collection = [];
        tilesDivCollection.forEach(function(tiles){
            if(tiles.classList.contains(`${marker}`)){
                collection.push(Number(tiles.dataset.tile));
            }
        });
        players[index].tiles = collection;
    };

    const _switchTurn = function(){
        if(boardDiv.classList.contains('x-turn')){
            boardDiv.classList.remove('x-turn');
            boardDiv.classList.add('o-turn');
            // console.log(`${players[1].name} turn!`);
            marker = players[1].mark; }
        else {
            boardDiv.classList.remove('o-turn');
            boardDiv.classList.add('x-turn');
            // console.log(`${players[0].name} turn!`);
            marker = players[0].mark;
        }
        _checkComputerTurn();
    };

    const _checkWin = function(){
        let index;
        if(marker == players[0].mark) index = 0;
        else { index = 1; }
        WINNING_COMBINATION.forEach(function(array){
            let trueCounter = 0;
            if(players[index].tiles.includes(array[0])) trueCounter++;
            if(players[index].tiles.includes(array[1])) trueCounter++;
            if(players[index].tiles.includes(array[2])) trueCounter++;
            if(trueCounter === 3) 
                message = `${players[index].name} Wins!`;
        });
    };

    const _checkDraw = function(){
        let target = 0
        tilesDivCollection.forEach(function(tile){
            if(tile.className !== 'tiles') target++;
        });
        if(target === 9 && message == false) message = 'Draw!'; 
    };

    const _endGame = (msg) => display.matchEnded(msg);

    const _checkComputerTurn = () => {
        if(mode === 'vsComputer' && (players[_computerIndex()].name == 'Computer'
            && players[_computerIndex()].mark == marker)){
            _computerTurn();
        }
    };

    const _computerTurn = () => {
        let target = generateNumber();
        tilesDivCollection.forEach(function(tile){
            tile.setAttribute('style', 'pointer-events: none; border-color: gray;');
        });
        setTimeout(() => {
            tilesDivCollection.forEach(function(tile){
                tile.removeAttribute('style');
            });
        }, 1499);
        setTimeout(() => tilesDivCollection[target-1].click(),1500);
    };

    const start = (event) => {
        let playerOne;
        let playerTwo;
        let num = 1;

        tilesDivCollection.forEach(function(tile){
            tile.setAttribute('data-tile', `${num}`);
            num++;
        });

        if(event){
            display.modeIsSelected();
            mode = event.target.id;
        }

        if(mode === 'twoPlayer'){
            playerOne = Player('Player X', 'x');
            playerTwo = Player('Player O', 'o'); }
        else if(mode === 'vsComputer'){
            playerOne = Player('Player', 'x');
            playerTwo = Player('Computer', 'o'); }
        else { return; }
        players.push(playerOne);
        players.push(playerTwo);

        // console.log(`${playerOne.name} turn!`);
        resetEvent();
        marker = playerOne.mark;
        boardDiv.classList.add('x-turn');
        _checkComputerTurn();
    };

    const markTile = (event) => {
        if(!event) return;
        event.target.classList.add(marker);
        _recordPlayerTiles();
        _checkWin();
        _checkDraw();
        if(message === false){
            _switchTurn(); }
        else { _endGame(message); }
    };

    const restart = () => {
        tilesDivCollection.forEach(function(tile){
            tile.className = 'tiles';
        });
        players = [];
        marker = '';
        message = false;
        display.restartGame();
        start();
    };

    const home = () => {
        mode = '';
        restart();
        display.backToHome();
    };

    return {
        start, markTile, restart, home
    }

})();

const playButton = document.querySelector('#playButton');
playButton.addEventListener('click', display.playIsClicked);

const modeButtons = document.querySelectorAll('[data-mode]');
modeButtons.forEach((button) => button.addEventListener('click', game.start));

const resetEvent = function(){
    const tilesDivCollection = document.querySelectorAll('[data-tile]');

    tilesDivCollection.forEach((tile) => tile.removeEventListener('click', 
    game.markTile));
    tilesDivCollection.forEach((tile) => tile.addEventListener('click', 
    game.markTile, { once: true}));
};

const restartBtn = document.querySelector('#restartButton');
restartBtn.addEventListener('click', game.restart);

const homeBtn = document.querySelector('#homeButton');
homeBtn.addEventListener('click', game.home);

const quitBtn = document.querySelector('#quitButton');
quitBtn.addEventListener('click', display.exit);

const menuBtn = document.querySelector('#menuButton');
menuBtn.addEventListener('click', display.menuIsClicked);

const closeMenuBtn = document.querySelector('#closeMenuButton');
closeMenuBtn.addEventListener('click', display.closeMenu);


//vsComputer: u should be able to select mark
//add minimax