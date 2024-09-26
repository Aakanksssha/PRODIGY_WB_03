const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const winningLineCanvas = document.getElementById('winningLine');
const modal = document.getElementById('resultModal');
const modalText = document.getElementById('modal-text');
const closeModal = document.getElementById('closeModal');
const closeBtn = document.querySelector('.close');

let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedIndex = clickedCell.getAttribute('data-index');

    if (gameState[clickedIndex] !== "" || !gameActive) {
        return;
    }

    gameState[clickedIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add('clicked');
    checkResult();
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winConditions.length; i++) {
        const winCondition = winConditions[i];
        const [a, b, c] = [gameState[winCondition[0]], gameState[winCondition[1]], gameState[winCondition[2]]];

        if (a === "" || b === "" || c === "") continue;
        if (a === b && b === c) {
            roundWon = true;
            drawWinningLine(winCondition);
            break;
        }
    }

    if (roundWon) {
        endGame(`${currentPlayer} Wins!`);
        triggerConfetti();
        return;
    }

    if (!gameState.includes("")) {
        endGame("It's a draw!");
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function endGame(result) {
    gameActive = false;
    modalText.textContent = result;
    modal.style.display = "block";
}

function drawWinningLine(winCondition) {
    const lineStart = document.querySelector(`.cell[data-index="${winCondition[0]}"]`);
    const lineEnd = document.querySelector(`.cell[data-index="${winCondition[2]}"]`);
    const startCoords = lineStart.getBoundingClientRect();
    const endCoords = lineEnd.getBoundingClientRect();

    const ctx = winningLineCanvas.getContext('2d');
    ctx.clearRect(0, 0, winningLineCanvas.width, winningLineCanvas.height);

    ctx.beginPath();
    ctx.moveTo(startCoords.x + startCoords.width / 2, startCoords.y + startCoords.height / 2);
    ctx.lineTo(endCoords.x + endCoords.width / 2, endCoords.y + endCoords.height / 2);
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 5;
    ctx.stroke();

    
}

function triggerConfetti() {
    // Add your confetti logic here
    // Example using a confetti library:
    // confetti({ particleCount: 100, spread: 70 });
}

function restartGame() {
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `Player X's turn`;
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('clicked');
    });
    winningLineCanvas.getContext('2d').clearRect(0, 0, winningLineCanvas.width, winningLineCanvas.height);
    modal.style.display = "none";
}

function handleOutsideClick(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
closeModal.addEventListener('click', () => modal.style.display = "none");
closeBtn.addEventListener('click', () => modal.style.display = "none");
window.addEventListener('click', handleOutsideClick);
