// JavaScript Code

let navTrigger = document.getElementsByClassName('nav-trigger')[0];
let body = document.getElementsByTagName('body')[0];

navTrigger.addEventListener('click', function(event) {
    event.preventDefault();
    body.classList.toggle('nav-open');
});

const grid = document.getElementById("grid");
let lockGame = false;
const testMode = false;

generateGrid();

function generateGrid() {
    lockGame = false;
    grid.innerHTML = "";
    for (let i = 0; i < 20; i++) {
        let row = grid.insertRow(i);
        for (let j = 0; j < 20; j++) {
            let cell = row.insertCell(j);
            cell.onclick = function () { init(this); };
            let mine = document.createAttribute("mine");
            mine.value = "false";
            cell.setAttributeNode(mine);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let financesButton = document.querySelector('#financesBtn');
    let constructionButton = document.querySelector('#constructionBtn');
    let finances = document.querySelector('.finances');
    let construction = document.querySelector('.construction');

    financesButton.addEventListener('click', function() {
        finances.classList.remove('hidden');
        construction.classList.add('hidden');
    });

    constructionButton.addEventListener('click', function() {
        construction.classList.remove('hidden');
        finances.classList.add('hidden');
    });
});

function selectBuilding(buildingType) {
    console.log(`${buildingType} selected`);
    // Additional logic to handle building selection
}

function enterDemolishMode() {
    console.log("Demolish mode activated");
    // Additional logic to handle demolish mode
}

function nextTurn() {
    console.log("Next turn");
    // Additional logic to handle next turn
}

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid-container');

    // Generate the grid squares
    for (let i = 0; i < 400; i++) {  // 20x20 grid
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.addEventListener('click', () => {
            if (isDemolishMode) {
                demolishStructure(cell);
            } else {
                buildStructure(cell);
            }
        });
        grid.appendChild(cell);
    }

    startGame(); // Initialize the game here to ensure the initial buildings are selected
});

const buildingTypes = {
    residential: {
        description: 'Residential (R): If it is next to an industry (I), then it scores 1 point only. Otherwise, it scores 1 point for each adjacent residential (R) or commercial (C), and 2 points for each adjacent park (O).',
        icon: 'R',
        upkeep: 1,
        profit: 1
    },
    industry: {
        description: 'Industry (I): Scores 1 point per industry in the city. Each industry generates 1 coin per residential building adjacent to it.',
        icon: 'I',
        upkeep: 1,
        profit: 2
    },
    commercial: {
        description: 'Commercial (C): Scores 1 point per commercial adjacent to it. Each commercial generates 1 coin per residential adjacent to it.',
        icon: 'C',
        upkeep: 2,
        profit: 3
    },
    park: {
        description: 'Park (O): Scores 1 point per park adjacent to it.',
        icon: 'O',
        upkeep: 1,
        profit: 0
    },
    road: {
        description: 'Road (*): Scores 1 point per connected road (*) in the same row.',
        icon: '*',
        upkeep: 1,
        profit: 0
    }
};

let currentBuilding = null;
let availableBuildings = [];
let score = 0;
let coins = 16;
let turnCount = 1;
let isFirstBuildingPlaced = false;
let isDemolishMode = false;

function updateScoreBoard() {
    document.getElementById('score-display').innerText = score;
    document.getElementById('coins-display').innerText = coins;
}

function updateTurnCount() {
    document.getElementById('turn-display').innerText = `Turn: ${turnCount}`;
}

function chooseBuilding(buildingType) {
    if (!availableBuildings.includes(buildingType)) return;

    // Remove the 'selected' class from all buildings
    document.querySelectorAll('.building-type').forEach(building => {
        building.classList.remove('selected');
    });

    // Add the 'selected' class to the clicked building
    document.getElementById(buildingType).classList.add('selected');
    currentBuilding = buildingType;

    // Update the description
    document.getElementById('building-description').innerText = buildingTypes[buildingType].description;

    // Exit demolish mode when a building is selected
    isDemolishMode = false;
    clearDemolishHighlights();
}

function getRandomBuilding(exclude) {
    const buildingKeys = Object.keys(buildingTypes).filter(key => key !== exclude && !availableBuildings.includes(key));
    const randomIndex = Math.floor(Math.random() * buildingKeys.length);
    return buildingKeys[randomIndex];
}

function startGame() {
    updateTurnCount();
    availableBuildings = [getRandomBuilding(null), getRandomBuilding(null)];
    updateBuildingUI();
    updateScoreBoard();
}

function updateBuildingUI() {
    document.querySelectorAll('.building-type').forEach(building => {
        if (!availableBuildings.includes(building.id)) {
            building.classList.add('disabled');
        } else {
            building.classList.remove('disabled');
        }
        building.classList.remove('selected');
    });

    // Automatically select the first available building
    chooseBuilding(availableBuildings[0]);
}

function highlightValidCells() {
    const gridCells = document.querySelectorAll('.grid-cell');

    gridCells.forEach(cell => {
        cell.classList.remove('highlight');
        if (isFirstBuildingPlaced) {
            const neighbors = getAdjacentCells(cell);
            if (neighbors.some(neighbor => neighbor.classList.contains('built'))) {
                cell.classList.add('highlight');
            }
        } else {
            cell.classList.add('highlight');
        }
    });
}

function buildStructure() {
    if (currentBuilding) {
        isDemolishMode = false; // Exit demolish mode
        clearDemolishHighlights(); // Clear any demolish highlights when entering build mode
        highlightValidCells();
    } else {
        alert('Please select a building type first.');
    }
}

function buildStructure(cell) {
    if (cell.classList.contains('highlight') && coins > 0) {
        cell.innerText = buildingTypes[currentBuilding].icon;
        cell.classList.add('built');
        cell.classList.remove('highlight');

        coins -= 1;
        updateScoreBoard();

        if (!isFirstBuildingPlaced) {
            isFirstBuildingPlaced = true;
        }

        // Remove highlight from all cells
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.classList.remove('highlight');
        });

        // Update available buildings for next turn
        const remainingBuilding = availableBuildings.find(b => b !== currentBuilding);
        const newBuilding = getRandomBuilding(remainingBuilding);
        availableBuildings = [currentBuilding, newBuilding];

        // Update the UI for new buildings
        updateBuildingUI();

        // End turn and update coins, score, and turn count
        endTurn();
    }
}

// Enter demolish mode
function enterDemolishMode() {
    isDemolishMode = true;
    currentBuilding = null; // Clear selected building when entering demolish mode
    clearBuildHighlights(); // Clear any build highlights when entering demolish mode
    document.querySelectorAll('.building-type').forEach(building => {
        building.classList.remove('selected');
    });
    highlightDemolishableBuildings();
}

// Highlight demolishable buildings
function highlightDemolishableBuildings() {
    const gridCells = document.querySelectorAll('.grid-cell');
    gridCells.forEach(cell => {
        if (cell.classList.contains('built') && isOuterLayer(cell)) {
            cell.classList.add('highlight-demolish');
        }
    });
}

// Check if the building is on the outer layer
function isOuterLayer(cell) {
    const neighbors = getAdjacentCells(cell);
    return neighbors.some(neighbor => !neighbor.classList.contains('built'));
}

// Demolish a building
function demolishStructure(cell) {
    if (coins > 0 && isDemolishMode && cell.classList.contains('built') && isOuterLayer(cell)) {
        // Remove building
        cell.innerText = '';
        cell.classList.remove('built', 'highlight-demolish');

        // Deduct coin
        coins -= 1;
        updateScoreBoard();

        // Exit demolish mode
        isDemolishMode = false;
        clearDemolishHighlights();

        // End turn and update coins, score, and turn count
        endTurn();
    } else if (coins <= 0) {
        alert('Not enough coins to demolish a building.');
    }
}

// Remove highlight from all cells
function clearDemolishHighlights() {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('highlight-demolish');
    });
}

function clearBuildHighlights() {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('highlight');
    });
}

function endTurn() {
    updateProfitAndUpkeep();
    updateScore();
    turnCount += 1;
    updateTurnCount();
}

function updateProfitAndUpkeep() {
    let profit = 0;
    let upkeep = 0;
    const gridCells = document.querySelectorAll('.grid-cell');

    gridCells.forEach(cell => {
        if (cell.classList.contains('built')) {
            const buildingType = Object.keys(buildingTypes).find(key => buildingTypes[key].icon === cell.innerText);
            if (buildingType) {
                profit += buildingTypes[buildingType].profit;
                upkeep += buildingTypes[buildingType].upkeep;

                if (buildingType === 'industry') {
                    const neighbors = getAdjacentCells(cell).filter(neighbor => neighbor.innerText === 'R');
                    profit += neighbors.length; // Each adjacent residential building generates 1 coin
                } else if (buildingType === 'commercial') {
                    const neighbors = getAdjacentCells(cell).filter(neighbor => neighbor.innerText === 'R');
                    profit += neighbors.length; // Each adjacent residential building generates 1 coin
                }
            }
        }
    });

    const residentialClusters = [];
    const visited = new Set();

    gridCells.forEach(cell => {
        if (cell.classList.contains('built') && cell.innerText === 'R' && !visited.has(cell)) {
            const cluster = [];
            const stack = [cell];

            while (stack.length) {
                const current = stack.pop();
                if (!visited.has(current)) {
                    visited.add(current);
                    cluster.push(current);

                    const neighbors = getAdjacentCells(current).filter(neighbor => neighbor.innerText === 'R');
                    neighbors.forEach(neighbor => {
                        if (!visited.has(neighbor)) {
                            stack.push(neighbor);
                        }
                    });
                }
            }

            if (cluster.length) {
                residentialClusters.push(cluster);
            }
        }
    });

    upkeep += residentialClusters.length; // Each cluster of residential buildings requires 1 coin per turn

    coins += profit - upkeep;
    updateScoreBoard();

    if (coins <= 0) {
        alert('Game Over! You have run out of coins.');
    }
}

function updateScore() {
    score = 0;
    const gridCells = document.querySelectorAll('.grid-cell');

    gridCells.forEach(cell => {
        if (cell.classList.contains('built')) {
            const buildingType = Object.keys(buildingTypes).find(key => buildingTypes[key].icon === cell.innerText);
            if (buildingType) {
                switch (buildingType) {
                    case 'residential':
                        const adjacentBuildings = getAdjacentCells(cell);
                        adjacentBuildings.forEach(neighbor => {
                            if (neighbor.innerText === 'R' || neighbor.innerText === 'C') {
                                score += 1;
                            } else if (neighbor.innerText === 'O') {
                                score += 2;
                            } else if (neighbor.innerText === 'I') {
                                score += 1;
                            }
                        });
                        break;
                    case 'industry':
                        const allBuildings = Array.from(document.querySelectorAll('.grid-cell.built'));
                        const industryCount = allBuildings.filter(b => b.innerText === 'I').length;
                        score += industryCount;
                        break;
                    case 'commercial':
                        const adjacentCommercials = getAdjacentCells(cell).filter(neighbor => neighbor.innerText === 'C');
                        score += adjacentCommercials.length;
                        break;
                    case 'park':
                        const adjacentParks = getAdjacentCells(cell).filter(neighbor => neighbor.innerText === 'O');
                        score += adjacentParks.length;
                        break;
                    case 'road':
                        const connectedRoads = getConnectedRoads(cell);
                        score += connectedRoads.length;
                        break;
                    default:
                        break;
                }
            }
        }
    });

    updateScoreBoard();
}

function getAdjacentCells(cell) {
    const cells = Array.from(document.querySelectorAll('.grid-cell'));
    const cellIndex = cells.indexOf(cell);
    const adjacentCells = [];

    if (cellIndex >= 20) {
        adjacentCells.push(cells[cellIndex - 20]);
    }
    if (cellIndex < 380) {
        adjacentCells.push(cells[cellIndex + 20]);
    }
    if (cellIndex % 20 !== 0) {
        adjacentCells.push(cells[cellIndex - 1]);
    }
    if (cellIndex % 20 !== 19) {
        adjacentCells.push(cells[cellIndex + 1]);
    }

    return adjacentCells;
}

function getConnectedRoads(cell) {
    const cells = Array.from(document.querySelectorAll('.grid-cell'));
    const row = Math.floor(cells.indexOf(cell) / 20);
    const rowCells = cells.slice(row * 20, (row + 1) * 20);

    let connectedRoads = [];
    let isConnected = false;

    rowCells.forEach(rowCell => {
        if (rowCell === cell) {
            isConnected = true;
        }
        if (isConnected && rowCell.innerText === '*') {
            connectedRoads.push(rowCell);
        }
    });

    return connectedRoads;
}

document.querySelectorAll('.building-type').forEach(button => {
    button.addEventListener('click', () => chooseBuilding(button.id));
});

document.getElementById('demolish-button').addEventListener('click', enterDemolishMode);

updateScoreBoard();
