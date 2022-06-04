gameScreen = document.getElementById('gameScreen');
numberOfColumns = 4;
numberOfRows = 3;
isGameRunning = false;
fwColors = ['blue', 'cyan', 'orange', 'pink', 'purple', 'purple2', 'white'];
images = [];
for(let i=1; i<= 12; i++){
    images.push((i > 6) ? (i - 6) : i)
}
total = 12;

//posicionar elementos na tela
function draw(){
    document.getElementById('gameInstructions').style.width = gameScreen.offsetWidth + 'px';
    document.getElementById('gameInstructions').style.height = (gameScreen.offsetHeight * 0.1) + 'px';
    document.getElementById('timer').style.height = (gameScreen.offsetHeight * 0.1) + 'px';
    document.getElementById('instructionText').style.marginTop = (document.getElementById('gameInstructions').offsetHeight * 0.5) + 'px';
    if(memes[0]){
        for(let i=0; i< total; i++){
            memes[i].style.height = (gameScreen.offsetHeight * 30 / 100) + 'px';
            memes[i].style.width = (gameScreen.offsetWidth * 25 / 100) + 'px';
            memes[i].style.marginLeft = (gameScreen.offsetWidth * 25 / 100) * (i+1 > numberOfColumns ?  i % numberOfColumns : i ) + 'px';
            memes[i].style.marginTop = (gameScreen.offsetHeight * 10 / 100) + (gameScreen.offsetHeight * 30 / 100) * parseInt(i / numberOfColumns) + 'px';
        }
    }
}

//reposicionar elementos no resize da tela
window.addEventListener("resize", ()=>{
    gameScreen = document.getElementById('gameScreen');
    draw();
});

//tempo para memorizar imagens
function memorizeTime(time){
    document.getElementById('timer').style.animation = 'timer-animation-reverse ' + time + 's linear';

    setTimeout(()=>{
        document.getElementById('timer').style.animation = '';
        document.getElementById('timer').style.width = 0;
        gameStart(20);
    }, time * 1000)
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
                screens.gameOver();
            }
        }, 1000);
    }
}

//imagem selecionada
function imageSelected(img, imgNumber){
    if(!img.classList.contains('correct') && isGameRunning){
        isGameRunning = false;
        img.classList.add('selected');
        img.src = 'imgs/meme'+imgNumber+'.jpg';
        selectedList = document.getElementsByClassName("selected");
        
        setTimeout(()=>{
            if(selectedList.length > 1){
                if(selectedList[0].classList.item(1) == selectedList[1].classList.item(1)){
                    selectedList[0].style.opacity = 0.2;
                    selectedList[1].style.opacity = 0.2;
                    selectedList[1].classList.add('correct');
                    selectedList[0].classList.add('correct');
                    if(document.getElementsByClassName("correct").length == 12){
                        screens.victory();
                        return 0;
                    }
                }
                else{
                    selectedList[0].src = 'imgs/card.png';
                    selectedList[1].src = 'imgs/card.png';
                }
                selectedList[1].classList.remove('selected');
                selectedList[0].classList.remove('selected');
            }
            isGameRunning = true;
        }, 700);
    }
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
        ClearPages();
        document.getElementById('gameOver').style.display = 'flex';
    },
    victory: ()=>{
        ClearPages();
        document.getElementById('victory').style.display = 'flex';
        spawnFireworks();
    }
}
function ClearPages(){
    document.getElementById('initialMenu').style.display = 'none';
    document.getElementById('gameRunning').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('victory').style.display = 'none';
}

//carregar jogo
document.getElementById('medium').onclick = ()=>loadGame();

function loadGame(){
    gameReset();
    screens.gameRunning();
    x = total;

    for(let i=0; i<numberOfRows; i++){
        for(let j=0; j<numberOfColumns; j++){
            randomNumber = parseInt(Math.random() * x + 1);

            if(randomNumber == x){
                randomNumber--;
            }

            new Meme(j,i, images[randomNumber]);
            
            aux = [];

            for(let k=0; k < images.length; k++){
                if(k != randomNumber){
                    aux.push(images[k])
                }
            }

            images = aux;
            x--;
        }
    }
    draw();
    memorizeTime(3);
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
    for(let i=1; i<= 12; i++){
        images.push((i > 6) ? (i - 6) : i)
    }
}

screens.initialMenu();
