let playerHealth = 100;
let enemyHealth = 100;
let timer = null;
let gameTimer = 60;
let countdown = null;

function updateHealthBars() {
    document.getElementById("playerHealthBar").style.height = playerHealth + "%";
    document.getElementById("enemyHealthBar").style.height = enemyHealth + "%";
}

//Reset after each game.
function resetGame() {
    playerHealth = 100;
    enemyHealth = 100;
    updateHealthBars();
    document.getElementById("result").innerText = "";
    clearTimeout(timer);
    clearInterval(countdown);
    gameTimer = 60;
    document.getElementById("timer").innerText = `Time Left: 60s`;
    updateImage("neutral");
    startGame();
}

//Game timer starts.
function startGame() {
    startTimer();
    countdown = setInterval(() => {
        gameTimer--;
        document.getElementById("timer").innerText = `Time Left: ${gameTimer}s`;
        if (gameTimer === 0) {
            clearInterval(countdown);
            checkWinner();
        }
    }, 1000);
}

//Start a timer for bait. If neither button is pressed, bait is selected instead.
function startTimer() {
    timer = setTimeout(() => {
        playerChoice = "bait";
        determineOutcome(playerChoice, getRandomAIChoice());
    }, 3000);
}

//Get a random choice for the enemy
function getRandomAIChoice() {
    //const choices = ["throw", "strike", "bait"];
    //choices[Math.floor(Math.random() * choices.length)]; -> commented out for posterity

    //weighted choice
    chance = Math.floor(Math.random() * 101) + 1;
    
    if (chance <= 10) {
        //10% chance to reversal
        return "reversal";
    }
    else if (chance <= 50) {
        //40% chance to throw
        return "throw";
    }
    else {
        //50% chance to block
        return "block";
    }
}

// Determine outcome based on player and AI choices
function determineOutcome(player, enemy) {
    let result = "";

    if (
        (player === "strike" && enemy === "block") ||
        (player === "bait" && enemy === "block") ||
        (player === "throw" && enemy === "throw")
    ) {
        //it ties
        result = "DRAW";

        //update image accordingly
        if (player === "strike" && enemy === "block") {
            //ai blocks,
            updateImage("block");
        } else if (player === "throw" && enemy === "throw") {
            //ai throw escapes
            updateImage("throw-escape");
        } else {
            //ai blocks, player baits
            updateImage("nothing");

        }
    } else if (
        (enemy === "reversal" && (player === "strike" || player === "throw")) ||
        (player === "block" && enemy === "throw")
    ) {
        //player loses
        playerHealth -= 20;
        result = "REVERSAL";

        //update images accordingly
        if (enemy === "reversal") {
            //ai successfully reversals
            updateImage("reversal");
        }
        else {
            //ai throws player
            updateImage("counter-throw");
        }
    } else if (player === "bait" && enemy === "reversal") {
        //player wins v. reversal
        enemyHealth -= 40;
        result = "PUNISH COUNTER";

        //update image
        updateImage("bait");
    } else {
        //player wins strike/throw
        enemyHealth -= 20;
        result = "COUNTER"

        //update image accordingly
        if (player === "strike" && enemy === "throw") {
            //player strikes ai
            updateImage("strike");
        }
        else {
            //player throws ai
            updateImage("throw");
        }
        
    }

    /**
    if (player === ai) {
        result = "It's a draw!";
    } else if (
        (player === "throw" && (enemy === "throw" || enemy === "bait")) ||
        (player === "strike" && (enemy === "strike" || enemy === "bait")) ||
        (player === "bait" && (enemy === "strike" || enemy === "throw"))
    ) {
        enemyHealth -= 20;
        result = "You hit the enemy!";
    } else {
        playerHealth -= 20;
        result = "You got hit!";
    }
     -> commented out for posterity */

    updateHealthBars();
    document.getElementById("result").innerText = result;

    if (playerHealth <= 0 || enemyHealth <= 0) {
        checkWinner();
    } else {
        setTimeout(resetRound, 2000);
    }
}

//Reset round logic, don't reset health though.
function resetRound() {
    playerChoice = null;
    document.getElementById("result").innerText = "";
    updateImage("knockdown")
    clearTimeout(timer);
    startTimer();
}

//Check who wins at the end of the timer or if health hits 0
function checkWinner() {
    let result = "";
    if (playerHealth > enemyHealth) {
        result = "You win!";
    } else if (enemyHealth > playerHealth) {
        result = "You lose.";
    } else {
        result = "DRAW!";
    }

    document.getElementById("result").innerText = result;
    //Game resets after 4 seconds so you can play again.
    setTimeout(resetGame, 4000);
}

//change image depending on game-state
function updateImage(state) {
    const image = document.getElementById('screenImage');

    if (state === "throw") {
        //ai gets thrown
        image.src = './states/throw.png';
    } else if (state === "strike") {
        //ai gets hit by strike
        image.src = './states/Strike.png';
    } else if (state === "bait") {
        //ai reversals into bait
        image.src = './states/reversal - block.png';
    } else if (state === "block") {
        //ai blocks the strike
        image.src = './states/strike - block.png';
    } else if (state === "nothing") {
        //ai blocks into bait
        image.src = './states/bait - block.png';
    } else if (state === "throw-escape") {
        //ai counter throws and escapes
        image.src = './states/throw - escape.png';
    } else if (state === "counter-throw") {
        //ai throws player
        image.src = './states/throw - bait.png';
    } else if (state === "reversal") {
        //ai reversals player
        image.src = './states/Reversal.png';
    } else if (state ==="knockdown") {
        //reset game to player decision
        image.src = './states/Knockdown.png';
    } else {
        //reset game state to start screen
        image.src = './states/neutral.png';
    }
}

//Event listeners for buttons
document.getElementById("throwButton").addEventListener("click", () => {
    playerChoice = "throw";
    clearTimeout(timer); //Stop bait timer because player picked throw.
    determineOutcome(playerChoice, getRandomAIChoice());
});

document.getElementById("strikeButton").addEventListener("click", () => {
    playerChoice = "strike";
    clearTimeout(timer); //Stop bait timer because player picked strike.
    determineOutcome(playerChoice, getRandomAIChoice());
});

//Start the game with the first round
resetGame();