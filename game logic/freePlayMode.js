document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');

    createGrid(5) // start at 5x5 grid


});

function createGrid(size) {
    grid.innerHTML='';

    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const box = document.createElement('div');
        box.classList.add('grid-box');
        box.addEventListener('click', () => {
            if (demolishMode) {
                demolishBuilding(box);
            }
            else {
                placeBuilding(box);
            }
        })
        grid.appendChild(box);
    }
}

function expandGrid(size) {
    createGrid(size);
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
let coins = 16;
let turnNumber = 1;
let demolishMode = false;
let buildingPlacedThisTurn = false;

function selectBuilding(buildingType) {
    selectedBuilding = buildingType;
    document.getElementById(selectedBuilding).classList.add('selected');
}

function placeBuilding(box) {
    if (!buildingPlacedThisTurn && selectedBuilding) {
        box.textContent = buildings[selectedBuilding].icon;
        box.classList.add(selectedBuilding);

        updateUI();

        buildingPlacedThisTurn = true;
        selectedBuilding = null;
    }
    else {
        alert("You have already placed a building in this turn. End your turn first")
        updateUI();
    }
}

function endTurn() {
    turnNumber++;
    document.getElementById('turn').textContent = turnNumber;
    buildingPlacedThisTurn = false;
}

function updateUI() {
    document.querySelectorAll('.building').forEach(building => {
        building.classList.remove('selected');
    });
}
