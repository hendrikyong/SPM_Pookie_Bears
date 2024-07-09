document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    createGrid(gridSize); // start at 5x5 grid

    // Show username modal
    const usernameModal = document.getElementById('username-modal');
    const startGameButton = document.getElementById('start-game-button');

    startGameButton.addEventListener('click', () => {
        const username = document.getElementById('username-input').value;
        if (username) {
            // Store the username or display it in the UI if needed
            console.log("Username:", username);
            usernameModal.style.display = 'none'; // Hide the modal
        } else {
            alert("Please enter a username");
        }
    });

    document.getElementById('load-game').addEventListener('change', loadGameState);
});

let gridSize = 5; // Initial grid size
let gridState = new Array(gridSize * gridSize).fill(null); // To store the state of the grid

function createGrid(size) {
    // clear grid content
    grid.innerHTML = '';

    // set grid properties on css for its size (col,row) (5x5)
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    // loop to create grid boxes based on the size ( size * size = n of rows, n of column )
    for (let i = 0; i < size * size; i++) {
        // div for each box in the grid
        const box = document.createElement('div');
        box.classList.add('grid-box');

        // if theres a building at the box in the loop, display the icon and type
        if (gridState[i]) {
            box.textContent = gridState[i].icon;
            box.classList.add(gridState[i].type);
        }

        // add event listener to each grid box
        box.addEventListener('click', () => {
            if (demolishMode) {
                demolishBuilding(box, i);
            } else {
                placeBuilding(box, i);
            }
        });
        // append this grid box to the html
        grid.appendChild(box);
    }
}

function expandGrid(newSize) {
    // MAX the grid size to 25x25
    newSize = Math.min(newSize, 25);

    if (newSize === 25 && !maxSizeAlerted) {
        alert("Reached max grid size!");
        maxSizeAlerted = true;
    }

    // make new array for expanded grid
    const newGridState = new Array(newSize * newSize).fill(null);

    // copy existing grid state into the new grid array
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            newGridState[i * newSize + j] = gridState[i * gridSize + j];
        }
    }

    gridSize = newSize;
    gridState = newGridState; // update the grid state to this new expanded grid state
    createGrid(gridSize);

}

const buildings = {
    residential: {
        description: 'Each residential building generates 1 coin per turn. Each cluster of residential buildings (must be immediately next to each other) requires 1 coin per turn to upkeep.',
        icon: 'R',
        upkeep: 1,
        profit: 1
    },
    industry: {
        description: 'Each industry generates 2 coins per turn and cost 1 coin per turn to upkeep.',
        icon: 'I',
        upkeep: 1,
        profit: 2
    },
    commercial: {
        description: 'Each commercial generates 3 coins per turn and cost 2 coins per turn to upkeep.',
        icon: 'C',
        upkeep: 2,
        profit: 3
    },
    park: {
        description: 'Each park costs 1 coin to upkeep',
        icon: 'O',
        upkeep: 1,
        profit: 0
    },
    road: {
        description: 'Each unconnected road segment costs 1 coin to upkeep.',
        icon: '*',
        upkeep: 1,
        profit: 0
    },
}

let selectedBuilding = null;
let points = 0;
// let coins = 16; unlimited for freeplay
let turnNumber = 1;
let demolishMode = false;
let buildingPlacedThisTurn = false;
let expandedThisTurn = false;
let maxSizeAlerted = false;


function selectBuilding(buildingType) {
    
    document.querySelectorAll('.building').forEach(building => {
        building.classList.remove('selected');
    });

    selectedBuilding = buildingType;
    document.getElementById(selectedBuilding).classList.add('selected');
    highlightValidPlacement()
}

function highlightValidPlacement() {
    clearHighlights();

    const boxes = document.querySelectorAll('.grid-box');
    const validIndices = new Set();

    // If the grid is empty, highlight all boxes
    if (gridState.every(cell => cell === null)) {
        boxes.forEach((box, index) => {
            box.classList.add('highlight');
        });
        return;
    }

    // Collect all indices of empty boxes adjacent to existing buildings
    gridState.forEach((cell, index) => {
        if (cell !== null) {
            const adjacents = getAdjacentsByIndex(index);
            adjacents.forEach(adj => {
                if (gridState[adj] === null) {
                    validIndices.add(adj);
                }
            });
        }
    });

    // Highlight only valid indices
    validIndices.forEach(index => {
        boxes[index].classList.add('highlight');
    });
}

function getAdjacentsByIndex(index) {
    const adjacents = [];
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    if (row > 0) adjacents.push(index - gridSize); // Up
    if (row < gridSize - 1) adjacents.push(index + gridSize); // Down
    if (col > 0) adjacents.push(index - 1); // Left
    if (col < gridSize - 1) adjacents.push(index + 1); // Right

    return adjacents;
}

function clearHighlights() {
    const boxes = document.querySelectorAll('.grid-box');
    boxes.forEach(box => {
        box.classList.remove('highlight');
    });
}


function placeBuilding(box, index) {
    if (!buildingPlacedThisTurn && selectedBuilding && box.classList.contains('highlight')) {
        
        // check if placed building is on the perimeter and expand the grid
        if (isOnPerimeter(index) && !expandedThisTurn) {
            gridState[index] = { type: selectedBuilding, icon: buildings[selectedBuilding].icon };
            expandGrid(gridSize + 10);
            expandedThisTurn = true;
            updateUI();
            buildingPlacedThisTurn = true;
            selectedBuilding = null;

            return;
        }
        // place the perimeter after expansion if there is an expansion
        if (!gridState[index] || gridState[index].type !== selectedBuilding) {
            box.textContent = buildings[selectedBuilding].icon;
            box.classList.add(selectedBuilding);
            gridState[index] = { type: selectedBuilding, icon: buildings[selectedBuilding].icon };

            updateUI();

            buildingPlacedThisTurn = true;
            selectedBuilding = null;
        }

        clearHighlights(); // Clear previous highlights
    } else if (!selectedBuilding) {
        alert("No building selected");
    } else if (!box.classList.contains('highlight')) {
        alert('You can only place a building in the highlighted boxes')
    } 
    
    else {
        alert("You have already placed a building in this turn. End your turn first");
        updateUI();
    }
}

function endTurn() {
    turnNumber++;
    document.getElementById('turn').textContent = turnNumber;
    buildingPlacedThisTurn = false;
    expandedThisTurn = false;
    calculateScore();
}

function updateUI() {
    document.querySelectorAll('.building').forEach(building => {
        building.classList.remove('selected');
    });
}

function toggleDemolishMode() {
    demolishMode = !demolishMode;

    const demolishButton = document.getElementById('demolish-button');
    if (demolishMode) {
        demolishButton.classList.add('active');
    } else {
        demolishButton.classList.remove('active');
    }
}

function demolishBuilding(box, index) {
    if (gridState[index]) {
        box.textContent = '';
        box.classList.remove(gridState[index].type);
        gridState[index] = null;
    }
}

function isOnPerimeter(index) {
    // calculate row and column of the box position based on the index and grid size
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    // check if the box position is on the perimeter (last or first row/column)
    return row === 0 || row === gridSize - 1 || col === 0 || col === gridSize - 1;
}

function calculateScore() {
    let score = 0;
    const grid = Array.from({ length: gridSize }, (_, i) => gridState.slice(i * gridSize, (i + 1) * gridSize));

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const building = grid[row][col];
            if (building) {
                switch (building.type) {
                    case 'residential':
                        score += scoreResidential(grid, row, col);
                        break;
                    case 'industry':
                        score += scoreIndustry(grid, row, col);
                        break;
                    case 'commercial':
                        score += scoreCommercial(grid, row, col);
                        break;
                    case 'park':
                        score += scorePark(grid, row, col);
                        break;
                    case 'road':
                        score += scoreRoad(grid, row);
                        break;
                }
            }
        }
    }

    points = score;
    document.getElementById('score').textContent = points;
}

function scoreResidential(grid, row, col) {
    const adjacents = getAdjacents(grid, row, col);
    let score = 0;
    console.log(`Scoring residential at (${row}, ${col}) with adjacents:`, adjacents);
    // check if adjacent to industry
    if (adjacents.some(b => b && b.type === 'industry')) {
        score = 1
        console.log(`Found industry adjacent to residential at (${row}, ${col}). Score: ${score}`);

        adjacents.forEach(b => {
            if (b) {
                if (b.type === 'residential' || b.type === 'commercial') {
                    score = 1;
                } else if (b.type === 'park') {
                    score = 1;
                }
            }
        });
        return score;

        
    }

    adjacents.forEach(b => {
        if (b) {
            if (b.type === 'residential' || b.type === 'commercial') {
                score += 1;
            } else if (b.type === 'park') {
                score += 2;
            }
        }
    });
    
    return score;
}


function scoreIndustry(grid, row, col) {
    return 1;
}

function scoreCommercial(grid, row, col) {
    let score = 0;
    const adjacents = getAdjacents(grid, row, col);
    adjacents.forEach(b => {
        if (b) {
            if (b.type === 'residential' || b.type === 'commercial') {
                score += 1;
            }
        }
    });
    return score;
}

function scorePark(grid, row, col) {
    let score = 0;
    const adjacents = getAdjacents(grid, row, col);
    score += adjacents.filter(b => b && b.type === 'park').length; // if theres a park adjacent, score 2 points
    return score;
}

function scoreRoad(grid, row) {
    let score = 0;
    let connectedRoads = 0;
    let hasConnectedSegment = false;

    for (let col = 0; col < gridSize; col++) {
        if (grid[row][col] && grid[row][col].type === 'road') {
            connectedRoads++;
            hasConnectedSegment = true;
        } else {
            if (connectedRoads > 1) {
                score += 1; // Score 1 point per connected road segment
            }
            connectedRoads = 0; // reset count for next row of roads
        }
    }

    // check if theres another road at the next row
    if (connectedRoads > 1) {
        score += 1;
    }

    // if the road is alone it does not generate any point
    if (!hasConnectedSegment) {
        score = 0;
    }

    return score;
}




function getAdjacents(grid, row, col) {
    const adjacents = [];
    const visited = new Set();
    const queue = [{ row, col }];

    // grid movement directions
    const directions = [
        { row: -1, col: 0 }, // up
        { row: 1, col: 0 },  // down
        { row: 0, col: -1 }, // left
        { row: 0, col: 1 }   // right
    ];

    visited.add(`${row},${col}`); // Mark the starting building as visited to skip itself

    // go through all the directions around a building for buildings
    while (queue.length > 0) {
        const { row: currentRow, col: currentCol } = queue.shift();

        // check all 4 directions
        for (const direction of directions) {
            const newRow = currentRow + direction.row;
            const newCol = currentCol + direction.col;

            // check if the new building is adjacent to a road and is not visited
            if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length && !visited.has(`${newRow},${newCol}`)) {
                const adjacent = grid[newRow][newCol];

                if (adjacent) {
                    visited.add(`${newRow},${newCol}`);
                    adjacents.push(adjacent);

                    // continue through to next road
                    if (adjacent.type === 'road') {
                        queue.push({ row: newRow, col: newCol });
                    }
                }
            }
        }
    }

    return adjacents;
}

function saveGame() {
    // Gather game state
    const gameState = {
        gridSize: gridSize,
        gridState: gridState,
        selectedBuilding: selectedBuilding,
        points: points,
        turnNumber: turnNumber,
        demolishMode: demolishMode,
        buildingPlacedThisTurn: buildingPlacedThisTurn,
        expandedThisTurn: expandedThisTurn
    };

    // Convert game state to JSON string
    const jsonGameState = JSON.stringify(gameState, null, 2);
    username 

    
    // Create a Blob with the JSON string
    const blob = new Blob([jsonGameState], { type: 'application/json' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game_state.json';
    a.textContent = 'Download JSON';

    // Append the link to the body
    document.body.appendChild(a);

    // Trigger a click event to initiate download
    a.click();

    // Clean up: remove the link and revoke the URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


// Function to load game state from a JSON file input
function loadGameState(event) {
    const input = event.target;
    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = function() {
        const jsonGameState = reader.result;
        const gameState = JSON.parse(jsonGameState);

        // Update game variables from loaded state
        gridSize = gameState.gridSize;
        gridState = gameState.gridState;
        selectedBuilding = gameState.selectedBuilding;
        points = gameState.points;
        turnNumber = gameState.turnNumber;
        demolishMode = gameState.demolishMode;
        buildingPlacedThisTurn = gameState.buildingPlacedThisTurn;
        expandedThisTurn = gameState.expandedThisTurn;

        // Recreate the grid with the loaded state
        createGrid(gridSize);
        updateUI();

        document.getElementById('turn').textContent = turnNumber;
        document.getElementById('score').textContent = points;

        document.getElementById('username-modal').style.display = 'none';
    };

    reader.readAsText(file);
}

// Attach event listener to input element for loading game state from file
document.getElementById('load-game').addEventListener('change', loadGameState);


