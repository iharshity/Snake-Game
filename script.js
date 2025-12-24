const board = document.querySelector(".board");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const startButton = document.querySelector(".btn-start");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart")

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00:00`

highScoreElement.innerText= highScore;

// calculate total no. of cols and rows in  board
const blockHeight = 30;
const blockWidth = 30;
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timerIntervalId = null;
let food = {x : Math.floor(Math.random()*rows), y : Math.floor(Math.random()*cols)}
let dir = "down";
const blocks = [];
let snake = [{x:1, y:3}];

// filling board with blocks
for(let row = 0; row < rows; row++){
    for(let col = 0; col < cols; col++){
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row} ${col}`] = block;
    }
}

// rendering function
function render(){
    let head = null;

    blocks[`${food.x} ${food.y}`].classList.add("food");

    if(dir === "left"){
        head = {x : snake[0].x, y : snake[0].y-1};
    }else if(dir === "right"){
        head = {x : snake[0].x, y : snake[0].y+1};
    }else if(dir === "down"){
        head = {x : snake[0].x+1, y : snake[0].y};
    }else if(dir === "up"){
        head = {x : snake[0].x-1, y : snake[0].y};
    }

    // wall collision check
    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
        clearInterval(intervalId);

        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";

        return;
    }

    // self collision check
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            clearInterval(intervalId);

            modal.style.display = "flex";
            startGameModal.style.display = "none";
            gameOverModal.style.display = "flex";

            return;
        }
    }

     // remove old snake
    snake.forEach(segment => {
        blocks[`${segment.x} ${segment.y}`].classList.remove("fill");
    });

    // add head ONCE
    snake.unshift(head);

    // food logic
    if(head.x === food.x && head.y === food.y){
        blocks[`${food.x} ${food.y}`].classList.remove("food");
        food = {x : Math.floor(Math.random()*rows), y : Math.floor(Math.random()*cols)}

        score += 10;
        scoreElement.innerText = score;

        if (score > highScore){
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
        }
    }else{
        // normal move
        snake.pop();
    }

    // draw snake
    snake.forEach(segment => {
        blocks[`${segment.x} ${segment.y}`].classList.add("fill");
    });

}

startButton.addEventListener("click", () => {
    clearInterval(intervalId);
    clearInterval(timerIntervalId);

    modal.style.display = "none";
    intervalId = setInterval(render, 200);

    timerIntervalId = setInterval(() => {
        let [min,sec] = time.split(":").map(Number);

        sec++;
        if (sec === 60) {
            min++;
            sec = 0;
        }

        time = `${min}:${sec}`;
        timeElement.innerText = time;
    },1000);
})

restartButton.addEventListener("click", restartGame)

function restartGame(){
    clearInterval(intervalId);
    clearInterval(timerIntervalId);

    blocks[`${food.x} ${food.y}`].classList.remove("food");
    snake.forEach( segment => {
        blocks[`${segment.x} ${segment.y}`].classList.remove("fill")
    })

    score = 0;
    time = `00:00`;

    scoreElement.innerText = score;
    highScoreElement.innerText = highScore;
    timeElement.innerText = time;

    modal.style.display = "none";
    dir = "down";
    snake = [{x:1, y:3}];
    food = {x : Math.floor(Math.random()*rows), y : Math.floor(Math.random()*cols)};
    intervalId = setInterval(render, 200);
    timerIntervalId = setInterval(() => {
        let [min,sec] = time.split(":").map(Number);

        sec++;
        if (sec === 60) {
            min++;
            sec = 0;
        }

        time = `${min}:${sec}`;
        timeElement.innerText = time;
    },1000);
}



addEventListener("keydown", (evt) => {
    const key = evt.key.toLowerCase(); // handles W/w, A/a, S/s, D/d
    if((key === "w" || key === "arrowup") && dir !== "down"){
        dir = "up";
    }else if ((key === "s" || key === "arrowdown") && dir !== "up"){
        dir = "down";
    }else if ((key === "a" || key === "arrowleft") && dir !== "right"){
        dir = "left";
    }else if ((key === "d" || key === "arrowright") && dir !== "left"){
        dir = "right";
    }
});

