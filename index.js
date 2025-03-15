let level = 0;
let sequence = [];
let userIndex = 0;
let gameStarted = false;
let inputEnabled = false;

const tileMap = {
    1: "w",
    2: "a",
    3: "s",
    4: "d"
};

$(document).keydown(function(event) {
    if (!gameStarted) {
        if (event.key === " ") {
            startGame();
        }
    } else {
        if (inputEnabled) {
            processInput(event);
        }
    }
});

$(".block").click(function(){
    if (!gameStarted || !inputEnabled) return;
    let classes = $(this).attr("class").split(" ");
    let tile = null;
    classes.forEach(c => {
        if (c.startsWith("block-") && c !== "block") {
            tile = parseInt(c.split("-")[1]);
        }
    });
    if (tile !== null) {
        handleUserInput(tile);
    }
});

function startGame() {
    level = 1;
    sequence = [];
    userIndex = 0;
    gameStarted = true;
    $('#title h1').text(`Level ${level < 10 ? "0" + level : level}`);
    nextSequence();
}

function nextSequence() {
    inputEnabled = false;
    userIndex = 0;
    let randomTile = Math.floor(Math.random() * 4) + 1;
    sequence.push(randomTile);
    let delay = 0;
    sequence.forEach((tile) => {
        setTimeout(() => {
            blink(tile);
            sound(tile);
        }, delay);
        delay += 200;
    });
    setTimeout(() => {
        inputEnabled = true;
    }, delay);
}

function handleUserInput(tile) {
    if (tile === sequence[userIndex]) {
        sound(tile);
        blink(tile);
        userIndex++;
        if (userIndex === sequence.length) {
            level++;
            setTimeout(() => {
                $('#title h1').text(`Level ${level < 10 ? "0" + level : level}`);
                nextSequence();
            }, 1000);
        }
    } else {
        gameOver();
    }
}

function processInput(event) {
    let keyPressed = event.key.toLowerCase();
    let tile = null;
    for (const [tileNum, key] of Object.entries(tileMap)) {
        if (key === keyPressed) {
            tile = parseInt(tileNum);
            break;
        }
    }
    if (tile !== null) {
         handleUserInput(tile);
    }
}

function gameOver() {
    let wrongAudio = new Audio("sounds/wrong.mp3");
    wrongAudio.play();
    $('#title h1').text("Game Over !!! Press Space to Restart");
    gameStarted = false;
    inputEnabled = false;
}

function blink(tile) {
    let blockSelector = `.block-${tile}`;
    $(blockSelector).addClass("blink");
    setTimeout(() => {
        $(blockSelector).removeClass("blink");
    }, 300);
}

function sound(tile) {
    let audio = new Audio(`sounds/block-${tile}.mp3`);
    audio.play();
}
