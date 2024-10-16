"use strict";

(() => {
window.addEventListener("load", () => {
// *****************************************************************************
// #region Constants and Variables

// Canvas references
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// UI references
const restartButton = document.querySelector("#restart");
const undoButton = document.querySelector('#undo');

// Constants
const CELLS_PER_AXIS = 3;  // Tic Tac Toe grid size
const CELL_WIDTH = canvas.width / CELLS_PER_AXIS;
const CELL_HEIGHT = canvas.height / CELLS_PER_AXIS;
let grids = [];  // History of game states

// Game objects
let currentPlayer = true;  // true for Player X, false for Player O

// #endregion


// *****************************************************************************
// #region Game Logic

function startGame() {
    const startingGrid = initializeGrid();
    initializeHistory(startingGrid);
    render(grids[0]);  // Render the initial empty grid
}

function initializeGrid() {
    return Array(CELLS_PER_AXIS * CELLS_PER_AXIS).fill("");  // Empty grid for Tic Tac Toe
}

function initializeHistory(startingGrid) {
    grids = [];
    grids.push(startingGrid);  // Add the initial empty grid to history
}

function rollBackHistory() {
    if (grids.length > 1) {  // Ensure there's a previous state to undo
        grids = grids.slice(0, grids.length - 1);  // Remove the latest move
        render(grids[grids.length - 1]);  // Re-render the previous grid
    }
}

function render(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

    for (let i = 0; i < grid.length; i++) {
        const row = Math.floor(i / CELLS_PER_AXIS);
        const column = i % CELLS_PER_AXIS;
        const xPos = column * CELL_WIDTH;
        const yPos = row * CELL_HEIGHT;

        // Draw the grid lines
        ctx.strokeStyle = 'white';
        ctx.strokeRect(xPos, yPos, CELL_WIDTH, CELL_HEIGHT);

        // Draw "X" or "O" if the cell is filled
        if (grid[i] === "X" || grid[i] === "O") {
            ctx.font = "48px Arial";  // Set font for X and O
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(grid[i], xPos + CELL_WIDTH / 2, yPos + CELL_HEIGHT / 2);  // Draw X or O in the center
        }
    }
}

function updateGridAt(mousePositionX, mousePositionY) {
    const gridCoordinates = convertCartesiansToGrid(mousePositionX, mousePositionY);

    // Check if the clicked cell is already taken
    if (grids[grids.length - 1][gridCoordinates.row * CELLS_PER_AXIS + gridCoordinates.column] !== "") {
        return;  // Do nothing if the cell is already filled
    }

    const newGrid = grids[grids.length - 1].slice();  // Create a copy of the current grid

    // Place either "X" or "O" depending on the current player
    newGrid[gridCoordinates.row * CELLS_PER_AXIS + gridCoordinates.column] = currentPlayer ? "X" : "O";

    grids.push(newGrid);  // Push the new grid to the history
    render(newGrid);  // Re-render the game board

    // Check if the current player has won
    if (checkWin(newGrid)) {
        alert(`Player ${currentPlayer ? "X" : "O"} wins!`);
        restart();  // Reset the game after a win
        return;
    }

    togglePlayer();  // Switch players
}

function togglePlayer() {
    currentPlayer = !currentPlayer;  // Toggle between Player X and Player O
}

function checkWin(grid) {
    // Check rows, columns, and diagonals
    for (let i = 0; i < CELLS_PER_AXIS; i++) {
        // Check rows
        if (grid[i * CELLS_PER_AXIS] === grid[i * CELLS_PER_AXIS + 1] && 
            grid[i * CELLS_PER_AXIS] === grid[i * CELLS_PER_AXIS + 2] &&
            grid[i * CELLS_PER_AXIS] !== "") {
            return true;
        }

        // Check columns
        if (grid[i] === grid[i + CELLS_PER_AXIS] && 
            grid[i] === grid[i + 2 * CELLS_PER_AXIS] &&
            grid[i] !== "") {
            return true;
        }
    }

    // Check diagonals
    if (grid[0] === grid[4] && grid[0] === grid[8] && grid[0] !== "") return true;
    if (grid[2] === grid[4] && grid[2] === grid[6] && grid[2] !== "") return true;

    return false;
}

function restart() {
    const emptyGrid = initializeGrid();  // Reset the grid
    grids = [emptyGrid];  // Reset the history
    currentPlayer = true;  // Reset to Player X's turn
    render(emptyGrid);  // Re-render the empty grid
}

// #endregion


// *****************************************************************************
// #region Event Listeners

canvas.addEventListener("mousedown", gridClickHandler);
function gridClickHandler(event) {
    updateGridAt(event.offsetX, event.offsetY);
}

restartButton.addEventListener("mousedown", restartClickHandler);
function restartClickHandler() {
    restart();
}

undoButton.addEventListener("mousedown", undoLastMove);
function undoLastMove() {
    rollBackHistory();
}

// #endregion


// *****************************************************************************
// #region Helper Functions

// To convert canvas coordinates to grid coordinates
function convertCartesiansToGrid(xPos, yPos) {
    return {
        column: Math.floor(xPos / CELL_WIDTH),
        row: Math.floor(yPos / CELL_HEIGHT)
    };
}

// #endregion

//Start game
startGame();

});
})();
