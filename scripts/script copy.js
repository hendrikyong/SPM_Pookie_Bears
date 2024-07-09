let navTrigger = document.getElementsByClassName('nav-trigger')[0];
body = document.getElementsByTagName('body')[0];

navTrigger.addEventListener('click', function() {
    event.preventDefault();
    body.classList.toggle('nav-open');
});



//Grid//
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const gridSize = 20; // Change this value to adjust the grid size
    let zoomLevel = 1;

    // Set the CSS grid template rows and columns dynamically
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`; // 40px is the fixed width of each square
    grid.style.gridTemplateRows = `repeat(${gridSize}, 40px)`;   // 40px is the fixed height of each square

    // Create the grid squares
    for (let m = 0; m < gridSize; m++) {
        for (let i = 0; i < gridSize; i++) {
            const square = document.createElement('div');
            // square.textContent = `${i},${m}`; // Display the coordinates of the square
            square.classList.add('grid-square');
            square.addEventListener('click', () => {
                if (demolishMode) {
                    demolishBuilding(square);
                } else {
                    placeBuilding(square);
                }
            });
            grid.appendChild(square);
        }
    }

    initializeGame(); // Initialize the game here to ensure the initial buildings are selected
    // Zoom In and Zoom Out functionality
    document.getElementById('zoom-in').addEventListener('click', () => {
        zoomLevel = Math.min(0.9, zoomLevel + 0.1); // Prevent zooming out too much
        // zoomLevel += 0.1;
        console.log(zoomLevel);
        grid.style.transform = `scale(${zoomLevel})`;
        //grid.style.transformOrigin = '0 0';
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        console.log(zoomLevel);
        zoomLevel = Math.max(0.4, zoomLevel - 0.1); // Prevent zooming out too much
        grid.style.transform = `scale(${zoomLevel})`;
        //grid.style.transformOrigin = '0 0';
    });

    // Add mouse wheel event for zooming
    // grid.addEventListener('wheel', (event) => {
    //     if (event.deltaY < 0) {
    //         zoomLevel += 0.1;
    //     } else {
    //         zoomLevel = Math.max(0.1, zoomLevel - 0.1);
    //     }
    //     grid.style.transform = `scale(${zoomLevel})`;
    //     grid.style.transformOrigin = '0 0';
    //     event.preventDefault(); // Prevent scrolling the page
    // });
});






//table
// document.addEventListener('DOMContentLoaded', () => {
//     const grid = document.getElementById('grid');
//     const gridSize = 80; // Change this value to adjust the grid size

//     // Create the table grid
//     for (let row = 0; row < gridSize; row++) {
//         const tr = document.createElement('tr');
//         for (let col = 0; col < gridSize; col++) {
//             const td = document.createElement('td');
//             td.classList.add('grid-square');
//             td.dataset.row = row;
//             td.dataset.col = col;
//             td.addEventListener('click', () => {
//                 if (demolishMode) {
//                     demolishBuilding(td);
//                 } else {
//                     placeBuilding(td);
//                 }
//             });
//             tr.appendChild(td);
//         }
//         grid.appendChild(tr);
//     }

//     initializeGame(); // Initialize the game here to ensure the initial buildings are selected

//     let zoomLevel = 1;

//     // Zoom In and Zoom Out functionality
//     document.getElementById('zoom-in').addEventListener('click', () => {
//         zoomLevel += 0.1;
//         grid.parentElement.style.transform = `scale(${zoomLevel})`;
//     });

//     document.getElementById('zoom-out').addEventListener('click', () => {
//         zoomLevel = Math.max(0.1, zoomLevel - 0.1); // Prevent zooming out too much
//         grid.parentElement.style.transform = `scale(${zoomLevel})`;
//     });

//     // Optional: Add mouse wheel event for zooming
//     grid.addEventListener('wheel', (event) => {
//         if (event.deltaY < 0) {
//             zoomLevel += 0.1;
//         } else {
//             zoomLevel = Math.max(0.1, zoomLevel - 0.1);
//         }
//         grid.parentElement.style.transform = `scale(${zoomLevel})`;
//         event.preventDefault(); // Prevent scrolling the page
//     });
// });







// const grid = document.getElementById("grid");
// let lockGame = false;
// // Set test mode to true if you want see mines location
// const testMode = false;
// generateGrid();

// // Generate 10 * 10 Grid
// function generateGrid() {
//     lockGame = false;
//     grid.innerHTML = "";
//     for (var i = 0; i < 10; i++) {
//         row = grid.insertRow(i);
//         for (var j = 0; j < 10; j++) {
//             cell = row.insertCell(j);
//             cell.onclick = function () { init(this); };
//             var mine = document.createAttribute("mine");
//             mine.value = "false";
//             cell.setAttributeNode(mine);
//         }
//     }
//     //generateMines();
// }


// Changing layout between construction and finances
document.addEventListener('DOMContentLoaded', function() {
    let financesButton = document.querySelector('#financesBtn');
    let constructionButton = document.querySelector('#constructionBtn');
    let finances = document.querySelector('.finances');
    let construction = document.querySelector('#container');

    financesButton.addEventListener('click', function() {
        console.log('Finances button clicked');
        finances.classList.remove('hidden');
        construction.classList.add('hidden');
    });

    constructionButton.addEventListener('click', function() {
        console.log('Construction button clicked');
        construction.classList.remove('hidden');
        finances.classList.add('hidden');
    });
});


//code

const buildings = {
    residential: {
        description: 'Residential (R): If it is next to an industry (I), then it scores 1 point only. Otherwise, it scores 1 point for each adjacent residential (R) or commercial (C), and 2 points for each adjacent park (O).',
        icon: 'R',
        image: './images/house.png',
        upkeep: 1,
        profit: 1
    },
    industry: {
        description: 'Industry (I): Scores 1 point per industry in the city. Each industry generates 1 coin per residential building adjacent to it.',
        icon: 'I',
        image: './images/industry.png',
        upkeep: 1,
        profit: 2
    },
    commercial: {
        description: 'Commercial (C): Scores 1 point per commercial adjacent to it. Each commercial generates 1 coin per residential adjacent to it.',
        icon: 'C',
        image: './images/commercial.png',
        upkeep: 2,
        profit: 3
    },
    park: {
        description: 'Park (O): Scores 1 point per park adjacent to it.',
        icon: 'O',
        image: './images/park.png',
        upkeep: 1,
        profit: 0
    },
    road: {
        description: 'Road (*): Scores 1 point per connected road (*) in the same row.',
        icon: '*',
        image: './images/road.png',
        upkeep: 1,
        profit: 0
    }
};

let selectedBuilding = null;
let selectedBuildings = [];
let points = 0;
let coins = 16;
let turnNumber = 1;
let firstBuildingPlaced = false;
let demolishMode = false;

function updateScoreboard() {
    document.getElementById('score-counter').innerText = points;
    document.getElementById('coins-counter').innerText = coins;
}

function updateTurnCounter() {
    document.getElementById('turn-counter').innerText = `${turnNumber}`;
}

function selectBuilding(buildingType) {
    console.log("Selected building: ", buildingType);
    if (!selectedBuildings.includes(buildingType)) return;

    // Remove the 'selected' class from all buildings
    document.querySelectorAll('.building').forEach(building => {
        building.classList.remove('selected');
    });

    // Add the 'selected' class to the clicked building
    document.getElementById(buildingType).classList.add('selected');
    selectedBuilding = buildingType;

    // Update the description
    document.getElementById('description-text').innerText = buildings[buildingType].description;

    // Exit demolish mode when a building is selected
    demolishMode = false;
    removeDemolishHighlights();
}

function getRandomBuilding(exclude) {
    const buildingKeys = Object.keys(buildings).filter(key => key !== exclude && !selectedBuildings.includes(key));
    const randomIndex = Math.floor(Math.random() * buildingKeys.length);
    return buildingKeys[randomIndex];
}

function initializeGame() {
    updateTurnCounter();
    selectedBuildings = [getRandomBuilding(null), getRandomBuilding(null)];
    updateSelectedBuildingsUI();
    updateScoreboard();
}

function updateSelectedBuildingsUI() {
    document.querySelectorAll('.building').forEach(building => {
        if (!selectedBuildings.includes(building.id)) {
            building.classList.add('disabled');
        } else {
            building.classList.remove('disabled');
        }
        building.classList.remove('selected');
    });

    // Automatically select the first available building
    selectBuilding(selectedBuildings[0]);
}

function highlightValidCells() {
    const gridSquares = document.querySelectorAll('.grid-square');

    console.log("First building placed: ", firstBuildingPlaced);

    gridSquares.forEach(square => {
        square.classList.remove('highlight');
        if (firstBuildingPlaced) {
            const neighbors = getNeighbors(square);
            if (neighbors.some(neighbor => neighbor.classList.contains('built'))) {
                square.classList.add('highlight');
            }
        } else {
            square.classList.add('highlight');
        }
    });
}

function buildStructure() {
    if (selectedBuilding) {
        const btn = document.getElementById("build-btn");
        btn.classList.add("selected");
        const demolishbtn = document.getElementById("demolish-btn");
        demolishbtn.classList.remove("selected");
        demolishMode = false; // Exit demolish mode
        removeDemolishHighlights(); // Clear any demolish highlights when entering build mode
        highlightValidCells();
    } else {
        alert('Please select a building type first.');
    }
}

function placeBuilding(square) {
    if (square.classList.contains('highlight') && coins > 0) {
        const img = document.createElement('img');
        img.src = buildings[selectedBuilding].image;
        img.alt = buildings[selectedBuilding].icon;
        square.innerHTML = '';
        square.appendChild(img);
        square.classList.add('built');
        square.classList.remove('highlight');

        coins -= 1;
        updateScoreboard();

        if (!firstBuildingPlaced) {
            firstBuildingPlaced = true;
        }

        // Remove highlight from all cells
        document.querySelectorAll('.grid-square').forEach(square => {
            square.classList.remove('highlight');
        });

        // Update selected buildings for next turn
        const remainingBuilding = selectedBuildings.find(b => b !== selectedBuilding);
        const newBuilding = getRandomBuilding(remainingBuilding);
        selectedBuildings = [selectedBuilding, newBuilding];

        // Update the UI for new buildings
        updateSelectedBuildingsUI();

        // End turn and update coins, points, and turn counter
        endTurn();
    }
}

// Enter demolish mode
function enterDemolishMode() {
    const demolishbtn = document.getElementById("demolish-btn");
    demolishbtn.classList.add("selected");
    const buildbtn = document.getElementById("build-btn");
    buildbtn.classList.remove("selected");
    demolishMode = true;
    selectedBuilding = null; // Clear selected building when entering demolish mode
    removeBuildHighlights(); // Clear any build highlights when entering demolish mode
    document.querySelectorAll('.building').forEach(building => {
        building.classList.remove('selected');
    });
    highlightDemolishableBuildings();
}

// Highlight demolishable buildings
function highlightDemolishableBuildings() {
    const gridSquares = document.querySelectorAll('.grid-square');
    gridSquares.forEach(square => {
        if (square.classList.contains('built') && isOuterLayer(square)) {
            square.classList.add('highlight-demolish');
        }
    });
}

// Check if the building is on the outer layer
function isOuterLayer(square) {
    const neighbors = getNeighbors(square);
    return neighbors.some(neighbor => !neighbor.classList.contains('built'));
}

// Demolish a building
function demolishBuilding(square) {
    if (coins > 0 && demolishMode && square.classList.contains('built') && isOuterLayer(square)) {
        // Remove building
        square.innerText = '';
        square.classList.remove('built', 'highlight-demolish');

        const builtSquaresCount = document.querySelectorAll('.grid-square.built').length;

        if (builtSquaresCount === 0) {
            firstBuildingPlaced = false;
        }

        // Deduct coin
        coins -= 1;
        updateScoreboard();

        // Exit demolish mode
        demolishMode = false;
        removeDemolishHighlights();

        // End turn and update coins, points, and turn counter
        endTurn();
    } else if (coins <= 0) {
        alert('Not enough coins to demolish a building.');
    }
}

// Remove highlight from all cells
function removeDemolishHighlights() {
    document.querySelectorAll('.grid-square').forEach(square => {
        square.classList.remove('highlight-demolish');
    });
}

function removeBuildHighlights() {
    document.querySelectorAll('.grid-square').forEach(square => {
        square.classList.remove('highlight');
    });
}

function endTurn() {
    updateProfitAndUpkeep();
    updatePoints();
    turnNumber += 1;
    updateTurnCounter();
    // Check if all squares are used
    const allSquaresUsed = Array.from(document.querySelectorAll('.grid-square')).every(square => square.classList.contains('built'));

    if (allSquaresUsed) {
        // Perform actions to end the game
        alert(`All squares are used. Game Over! Your final score is: ${points}!`);
        window.location.href = '../index.html';
    }
    else if (coins <= 0) {
        alert(`You ran out of coins. Game Over! Your final score is: ${points}!`);
        window.location.href = '../index.html';
    }
}

function updateProfitAndUpkeep() {
    let profit = 0;
    let upkeep = 0;
    const gridSquares = document.querySelectorAll('.grid-square');

    gridSquares.forEach(square => {
        if (square.classList.contains('built')) {
            const buildingType = Object.keys(buildings).find(key => buildings[key].icon === square.innerText);
            if (buildingType) {
                profit += buildings[buildingType].profit;
                upkeep += buildings[buildingType].upkeep;

                if (buildingType === 'industry') {
                    const neighbors = getNeighbors(square).filter(neighbor => neighbor.innerText === 'R');
                    profit += neighbors.length; // Each adjacent residential building generates 1 coin
                } else if (buildingType === 'commercial') {
                    const neighbors = getNeighbors(square).filter(neighbor => neighbor.innerText === 'R');
                    profit += neighbors.length; // Each adjacent residential building generates 1 coin
                }
            }
        }
    });

    const residentialClusters = [];
    const visited = new Set();

    gridSquares.forEach(square => {
        if (square.classList.contains('built') && square.innerText === 'R' && !visited.has(square)) {
            const cluster = [];
            const stack = [square];

            while (stack.length) {
                const current = stack.pop();
                if (!visited.has(current)) {
                    visited.add(current);
                    cluster.push(current);

                    const neighbors = getNeighbors(current).filter(neighbor => neighbor.innerText === 'R');
                    neighbors.forEach(neighbor => {
                        if (!visited.has(neighbor)) {
                            stack.push(neighbor);
                        }
                    });
                }
            }

            residentialClusters.push(cluster);
        }
    });

    residentialClusters.forEach(cluster => {
        upkeep += 1; // Each cluster requires 1 coin per turn to upkeep
    });

    coins += profit - upkeep;
    updateScoreboard();
}

function updatePoints() {
    points = 0;
    const gridSquares = document.querySelectorAll('.grid-square');

    let industryCalculated = false;

    gridSquares.forEach(square => {
        if (square.classList.contains('built')) {
            const buildingType = Object.keys(buildings).find(key => buildings[key].icon === square.innerText);
            const neighbors = getNeighbors(square);

            if (buildingType === 'residential') {
                if (neighbors.some(neighbor => neighbor.innerText === 'I')) {
                    points += 1;
                } else {
                    neighbors.forEach(neighbor => {
                        if (neighbor.innerText === 'R' || neighbor.innerText === 'C') {
                            points += 1;
                        } else if (neighbor.innerText === 'O') {
                            points += 2;
                        }
                    });
                }
            } else if (buildingType === 'industry' && !industryCalculated) {
                points += document.querySelectorAll('.grid-square.built').length;
                industryCalculated = true;
            } else if (buildingType === 'commercial') {
                neighbors.forEach(neighbor => {
                    if (neighbor.innerText === 'C') {
                        points += 1;
                    }
                });
            } else if (buildingType === 'park') {
                neighbors.forEach(neighbor => {
                    if (neighbor.innerText === 'O') {
                        points += 1;
                    }
                });
            } else if (buildingType === 'road') {
                const index = Array.from(document.querySelectorAll('.grid-square')).indexOf(square);
                const row = Math.floor(index / 20);
                const rowSquares = Array.from(document.querySelectorAll('.grid-square')).filter((sq, i) => {
                    const sqRow = Math.floor(i / 20);
                    return sqRow === row;
                });
                const roadIndices = rowSquares.reduce((acc, sq, i) => {
                    if (sq.innerText === '*') acc.push(i);
                    return acc;
                }, []);
            
                let pairs = 0;
                for (let i = 0; i < roadIndices.length - 1; i++) {
                    // Check if the current road square and the next one form a pair (consecutive indices)
                    if (roadIndices[i] + 1 === roadIndices[i + 1]) {
                        pairs++;
                        i++; // Skip the next index since it's already paired with the current one
                    }
                }
            
                points += pairs; // Increment points by the number of distinct pairs
            }
        }
    });

    updateScoreboard();
}

function saveGame() {
    alert("Game saved!");
}

function exitGame() {
    window.location.href = '../index.html';
}

function getNeighbors(square) {
    const grid = document.getElementById('grid');
    const squares = Array.from(grid.children);
    const index = squares.indexOf(square);
    const rowSize = Math.sqrt(squares.length);

    const neighbors = [];

    if (index % rowSize !== 0) { // left neighbor
        neighbors.push(squares[index - 1]);
    }
    if (index % rowSize !== rowSize - 1) { // right neighbor
        neighbors.push(squares[index + 1]);
    }
    if (index >= rowSize) { // top neighbor
        neighbors.push(squares[index - rowSize]);
    }
    if (index < squares.length - rowSize) { // bottom neighbor
        neighbors.push(squares[index + rowSize]);
    }

    console.log(neighbors);
    return neighbors;
}

// Show the modal
function showModal() {
    document.getElementById("legendModal").style.display = "block";
}

function showHelpModal() {
    document.getElementById("htpModal").style.display = "block";
    showContent('general'); // Show the general tab by default
}

// Close the modal
function closeModal() {
    document.getElementById("legendModal").style.display = "none";
}

function closeHelpModal() {
    document.getElementById("htpModal").style.display = "none";
}


// Show the content based on the tab clicked
function showContent(tabName) {
    var i;
    var tabContent = document.getElementsByClassName("tab-content");
    var tabButtons = document.getElementsByClassName("tab-button");

    // Hide all tab content
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove("active");
        tabContent[i].style.display = "none"; // Hide the content
    }

    // Remove active class from all tab buttons
    for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }

    // Show the selected tab content
    document.getElementById(tabName).classList.add("active");
    document.getElementById(tabName).style.display = "block"; // Display the content
    document.querySelector(`[onclick="showContent('${tabName}')"]`).classList.add("active");
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    var modal = document.getElementById("legendModal");
    if (event.target == modal || event.target == document.getElementById("htpModal")) {
        modal.style.display = "none";
        document.getElementById("htpModal").style.display = "none";
    }
}


window.onload = initializeGame;