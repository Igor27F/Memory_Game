gameScreen = document.getElementById('gameScreen');
numberOfColumns = 0;
numberOfRows = 0;
isGameRunning = false;
fwColors = ['blue', 'cyan', 'orange', 'pink', 'purple', 'purple2', 'white'];
difficult = '';
images = [];
total = 0;
totalMemes = 29;
var flipTimer;

//selecionar Imagens
function populateImages(){
    images = [];
    for(let i=1; i<= totalMemes; i++){
        images.push(i)
    }
}

//posicionar elementos na tela
function draw(){
    document.getElementById('gameInstructions').style.width = gameScreen.offsetWidth + 'px';
    document.getElementById('gameInstructions').style.height = (gameScreen.offsetHeight * 0.1) + 'px';
    document.getElementById('timer').style.height = (gameScreen.offsetHeight * 0.1) + 'px';
    document.getElementById('instructionText').style.marginTop = (document.getElementById('gameInstructions').offsetHeight * 0.5) + 'px';
    if(memes[0]){
        for(let i=0; i< total; i++){
            memes[i].style.height = (gameScreen.offsetHeight * (100/numberOfRows) / 100) + 'px';
            memes[i].style.width = (gameScreen.offsetWidth * (100/numberOfColumns) / 100) + 'px';
            memes[i].style.marginLeft = (gameScreen.offsetWidth * (100/numberOfColumns) / 100) * (i+1 > numberOfColumns ?  i % numberOfColumns : i ) + 'px';
            memes[i].style.marginTop = (gameScreen.offsetHeight * 10 / 100) + (gameScreen.offsetHeight * (100/numberOfRows) / 100) * parseInt(i / numberOfColumns) + 'px';
        }
    }
}

//reposicionar elementos no resize da tela
window.addEventListener("resize", ()=>{
    gameScreen = document.getElementById('gameScreen');
    draw();
});

//tempo para memorizar imagens
function memorizeTime(memTime, playTime){
    document.getElementById('timer').style.animation = 'timer-animation-reverse ' + memTime + 's linear';

    setTimeout(()=>{
        document.getElementById('timer').style.animation = '';
        document.getElementById('timer').style.width = 0;
        gameStart(playTime);
    }, memTime * 1000)
}

//começar jogo
function gameStart(time){
    for(let i=0; i< total; i++){
        memes[i].src = "imgs/card.png";
    }
    document.getElementById('timer').style.animation = 'timer-animation ' + time + 's linear';
    document.getElementById('instructionText').innerHTML = time;
    isGameRunning = true;
    gameLoop(time-1);
}

//jogo rodando
function gameLoop(time){
    if(document.getElementsByClassName('correct').length != total){
        setTimeout(()=>{
            document.getElementById('instructionText').innerHTML = time;
            if(time > 0){
                gameLoop(time-1);
            }
            else{
                if(isGameRunning){
                    screens.gameOver();
                }
            }
        }, 1000);
    }
}

//imagem selecionada
function imageSelected(img, imgNumber){
    if(!img.classList.contains('correct')){
        selectedList = document.getElementsByClassName("selected");

        if(selectedList.length == 2){
            clearTimeout(flipTimer);
            flipWrongImgs(selectedList[0], selectedList[1]);
        }
        
        img.classList.add('selected');
        img.src = 'imgs/meme'+imgNumber+'.jpg';
        
        if(selectedList.length == 2){
            first = selectedList[0];
            second = selectedList[1];
            if(first.classList.item(1) == second.classList.item(1)){
                first.style.opacity = 0.2;
                second.style.opacity = 0.2;
                first.classList.add('correct');
                second.classList.add('correct');
                second.classList.remove('selected');
                first.classList.remove('selected');
                if(document.getElementsByClassName("correct").length == total){
                    screens.victory();
                }
            }
            else{
                flipTimer = setTimeout(()=>{
                    flipWrongImgs(first, second);
                }, 2000)
            }
        }
    }
}
function flipWrongImgs(first, second){
    second.src = 'imgs/card.png';
    first.src = 'imgs/card.png';
    second.classList.remove('selected');     
    first.classList.remove('selected');    
}

//menu inicial
document.getElementById('gameStart').onclick = ()=>{
    document.getElementById('difficultSelection').style.visibility = 'visible';
    document.getElementById('gameStart').classList.remove('gameButton');
}

//Meme constructor
Meme = function(positionX, positionY, imgNumber){
    this.img = document.createElement("img");
    document.getElementById('gameRunning').appendChild(this.img);
    this.img.src = "imgs/meme" + imgNumber + ".jpg";
    this.img.draggable = false;
    this.img.className = 'meme';
    this.img.classList.add('meme' + imgNumber);
    this.img.onclick = ()=> {
        if(isGameRunning)
            imageSelected(this.img, imgNumber);
    };
    this.img.style.height = (gameScreen.offsetHeight * 30 / 100) + 'px';
    this.img.style.width = (gameScreen.offsetWidth * 25 / 100) + 'px';
    this.img.style.position = 'absolute';
    this.img.style.marginLeft = (gameScreen.offsetWidth * 25 / 100) * (positionX) + 'px';
    this.img.style.marginTop = (gameScreen.offsetHeight * 10 / 100) + (gameScreen.offsetHeight * 30 / 100) * (positionY) + 'px';
}

//firework constructor
Firework = function(){
    this.img = document.createElement("img");
    document.getElementById('victory').appendChild(this.img);
    randomColor = Math.floor(Math.random() * fwColors.length);
    this.img.src = "imgs/fw"+ fwColors[randomColor] +".gif";
    randomSize = Math.floor(Math.random() * (500 - 200 + 1) ) + 200;
    this.img.style.width = randomSize+'px';
    this.img.style.height = randomSize+'px';
    randomX = Math.floor(Math.random() * (gameScreen.offsetWidth + 101) - 100);
    randomY = Math.floor(Math.random() * (gameScreen.offsetHeight + 101) - 100);
    this.img.style.top = randomY + 'px';
    this.img.style.left = randomX + 'px';
    this.img.style.position = 'absolute';
    this.img.draggable = false;
    this.img.onclick = ()=>this.img.remove();
    setTimeout(()=>{
        this.img.remove();
    }, 2000);
}

InsaneMode = function(){
    this.h2 = document.createElement("h2");
    document.getElementById('difficultSelection').appendChild(this.h2);
    this.h2.id = 'insane';
    this.h2.className = 'difficult gameButton';
    this.h2.innerHTML = 'Insano';
    this.h2.style.color = 'red';
    this.h2.style.fontWeight = 'bold';
    this.h2.onclick = ()=>{difficult='insane';loadGame();};
}

//alterador de telas
screens = {
    initialMenu: ()=>{
        ClearPages();
        document.getElementById('difficultSelection').style.visibility = 'hidden';
        document.getElementById('gameStart').className= 'gameButton';
        document.getElementById('gameStart').innerHTML = 'Começar joguinho'
        document.getElementById('initialMenu').style.display = 'flex';
    },
    gameRunning: ()=>{
        ClearPages();
        document.getElementById('gameRunning').style.display = 'initial';
    },
    gameOver: ()=>{
        isGameRunning = false;
        ClearPages();
        document.getElementById('gameOver').style.display = 'flex';
    },
    victory: ()=>{
        isGameRunning = false;
        ClearPages();
        document.getElementById('victory').style.display = 'flex';
        spawnFireworks();
        if(difficult == 'hard') new InsaneMode();
    }
}
function ClearPages(){
    document.getElementById('initialMenu').style.display = 'none';
    document.getElementById('gameRunning').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('victory').style.display = 'none';
}

//carregar jogo
document.getElementById('easy').onclick = ()=>{difficult='easy';loadGame();}
document.getElementById('medium').onclick = ()=>{difficult='medium';loadGame();}
document.getElementById('hard').onclick = ()=>{difficult='hard';loadGame();}

function loadGame(){
    gameReset();
    screens.gameRunning();
    playTime = 0;
    switch(difficult){
        case 'easy':
            numberOfColumns = 3;
            numberOfRows = 2;
            playTime = 10;
            memTime = 3;
            break;
        case 'medium':
            numberOfColumns = 4;
            numberOfRows = 3;
            playTime = 15;
            memTime = 3;
            break;
        case 'hard':
            numberOfColumns = 6;
            numberOfRows = 4;
            playTime = 45;
            memTime = 0;
            break;
        case 'insane':
            numberOfColumns = 8;
            numberOfRows = 5;
            playTime = 90;
            memTime = 0;
            break;
    }
    total = numberOfColumns * numberOfRows;
    populateImages();
    aux = [];
    for(let i=0; i<total/2;i++){
        randomImage = Math.floor(Math.random() * (totalMemes - i));
        aux.push(images[randomImage],images[randomImage]);
        images.splice(randomImage,1);
    }
    for(let i=0; i<numberOfRows; i++){
        for(let j=0; j<numberOfColumns; j++){
            randomNumber = Math.floor(Math.random()*(total - j - (i*numberOfColumns)));
            new Meme(j,i, aux[randomNumber]);
            aux.splice(randomNumber,1);
        }
    }
    draw();
    if(memTime > 0){
        memorizeTime(memTime,playTime);
    }
    else{
        gameStart(playTime);
    }
}

//criar fireworks
function spawnFireworks(){
    if(!isGameRunning){
        setTimeout(()=>{
            new Firework();
            spawnFireworks();
        },200);
    }
}

//game over opções
document.getElementById('gameOverMenuReturn').onclick = ()=>{
    screens.initialMenu();
}
document.getElementById('menuReturn').onclick = ()=>{
    screens.initialMenu();
}
document.getElementById('tryAgain').onclick = ()=>{
    loadGame();
}

memes = document.getElementsByClassName("meme");

//resetar jogo
function gameReset(){
    if(memes.length > 0){
        for(let i=memes.length;i>0;i--){
            memes[i-1].remove();
        }
    }
    document.getElementById('instructionText').innerHTML = 'Memorize as cartas';
    images = [];
    populateImages();
}

screens.initialMenu();
