document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    createGrid(gridSize); // start at 5x5 grid
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

    if (size == 25) {
        alert("Reached max grid size!")
    }
}

function expandGrid(newSize) {
    // MAX the grid size to 25x25
    newSize = Math.min(newSize, 25);

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
let selectedBuildingsArray = [];
let points = 0;
// let coins = 16; unlimited for freeplay
let turnNumber = 1;
let demolishMode = false;
let buildingPlacedThisTurn = false;
let expandedThisTurn = false;

function selectBuilding(buildingType) {
    selectedBuilding = buildingType;
    document.getElementById(selectedBuilding).classList.add('selected');
}

function placeBuilding(box, index) {
    if (!buildingPlacedThisTurn && selectedBuilding) {
        
        // check if placed building is on the perimeter and expand the grid
        if (isOnPerimeter(index) && !expandedThisTurn) {
            gridState[index] = { type: selectedBuilding, icon: buildings[selectedBuilding].icon };
            expandGrid(gridSize + 10);
            expandedThisTurn = true;
            updateUI();
            
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
    } else if (!selectedBuilding) {
        alert("No building selected");
    } else {
        alert("You have already placed a building in this turn. End your turn first");
        updateUI();
    }
}

function endTurn() {
    turnNumber++;
    document.getElementById('turn').textContent = turnNumber;
    buildingPlacedThisTurn = false;
    expandedThisTurn = false;
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
