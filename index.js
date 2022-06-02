gameScreen = document.getElementById('gameScreen');
numberOfColumns = 4;
numberOfRows = 3;
images = [];
for(let i=1; i<= 12; i++){
    images.push((i > 6) ? (i - 6) : i)
}

document.getElementById('gameStart').onclick = function(){
    document.getElementById('difficultSelection').style.visibility = 'visible'
    document.getElementById('gameStart').style.color = 'black'
    document.getElementById('gameStart').style.cursor = 'initial'
    document.getElementById('gameStart').innerHTML = 'Selecione a dificuldade'
}

Meme = function(positionX, positionY, imgNumber){
    this.img = document.createElement("img");
    document.getElementById('gameRunning').appendChild(this.img);
    this.img.src = "imgs/meme" + imgNumber + ".jpg";
    this.img.className = 'meme';
    this.img.style.height = (gameScreen.offsetHeight * 30 / 100) + 'px';
    this.img.style.width = (gameScreen.offsetWidth * 25 / 100) + 'px';
    this.img.style.position = 'absolute';
    this.img.style.marginLeft = (gameScreen.offsetWidth * 25 / 100) * (positionX) + 'px';
    this.img.style.marginTop = (gameScreen.offsetHeight * 10 / 100) + (gameScreen.offsetHeight * 30 / 100) * (positionY) + 'px';
}

document.getElementById('medium').onclick = function(){
    document.getElementById('initialMenu').style.display = 'none'
    document.getElementById('gameRunning').style.display = 'initial'
    total = 12;

    for(let i=0; i<numberOfRows; i++){
        for(let j=0; j<numberOfColumns; j++){
            randomNumber = parseInt(Math.random() * total + 1);

            if(randomNumber == total){
                randomNumber--;
            }
            console.log(randomNumber);

            new Meme(j,i, images[randomNumber]);
            
            aux = [];

            for(let k=0; k < images.length; k++){
                if(k != randomNumber){
                    aux.push(images[k])
                }
            }

            images = aux;
            total--;
        }
    }
}


