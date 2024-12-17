const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');

const BOARD_SIZE = 15;  // 15x15 board
const CELL_SIZE = 30;   // Cell size (in pixels)
canvas.width = BOARD_SIZE * CELL_SIZE;
canvas.height = BOARD_SIZE * CELL_SIZE;

const PLAYER_1_COLOR = 'black';
const PLAYER_2_COLOR = 'white';

let board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
let currentPlayer = PLAYER_1_COLOR;
let gameOver = false;
let score = { player1: 0, player2: 0 };

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    for (let i = 0; i <= BOARD_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.strokeStyle = '#333';
        ctx.stroke();
    }

    // Draw stones
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const stone = board[row][col];
            if (stone) {
                ctx.beginPath();
                ctx.arc(col * CELL_SIZE + CELL_SIZE / 2, row * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 3, 0, Math.PI * 2);
                ctx.fillStyle = stone;
                ctx.fill();
            }
        }
    }
}

function checkWinner() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col]) {
                if (checkDirection(row, col, 1, 0) ||  // Horizontal
                    checkDirection(row, col, 0, 1) ||  // Vertical
                    checkDirection(row, col, 1, 1) ||  // Diagonal \
                    checkDirection(row, col, 1, -1)) { // Diagonal /
                    return true;
                }
            }
        }
    }
    return false;
}

function checkDirection(row, col, dRow, dCol) {
    const color = board[row][col];
    let count = 0;
    for (let i = 0; i < 5; i++) {
        const newRow = row + i * dRow;
        const newCol = col + i * dCol;
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && board[newRow][newCol] === color) {
            count++;
        } else {
            break;
        }
    }
    return count === 5;
}

function handleClick(event) {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((event.clientY - rect.top) / CELL_SIZE);

    if (board[y][x]) return; // Skip if the cell is already occupied

    // Place the stone
    board[y][x] = currentPlayer;
    drawBoard();

    if (checkWinner()) {
        alert(`${currentPlayer === PLAYER_1_COLOR ? 'Player 1' : 'Player 2'} wins!`);
        if (currentPlayer === PLAYER_1_COLOR) {
            score.player1++;
            player1Score.textContent = score.player1;
        } else {
            score.player2++;
            player2Score.textContent = score.player2;
        }
        gameOver = true;
    } else {
        currentPlayer = currentPlayer === PLAYER_1_COLOR ? PLAYER_2_COLOR : PLAYER_1_COLOR;
    }
}

function resetGame() {
    board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
    currentPlayer = PLAYER_1_COLOR;
    gameOver = false;
    drawBoard();
}

canvas.addEventListener('click', handleClick);
resetButton.addEventListener('click', resetGame);

drawBoard();  // Initialize the game board
