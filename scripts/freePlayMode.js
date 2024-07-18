let navTrigger = document.getElementsByClassName('nav-trigger')[0];
body = document.getElementsByTagName('body')[0];

navTrigger.addEventListener('click', function() {
    event.preventDefault();
    body.classList.toggle('nav-open');
});


document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    createGrid(gridSize); // start at 5x5 grid
    let zoomLevel = 1;
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

    document.getElementById('load-game-button').addEventListener('click', fetchGameStateFromDB);
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
            // box.textContent = gridState[i].icon;
            box.classList.add(gridState[i].type);
            const icon = gridState[i].icon;
            const img = document.createElement('img');
            img.src = buildings[gridState[i].type].image;
            img.alt = gridState[i].icon;
            box.appendChild(img);
            if (icon === 'R') {
                box.classList.add('built-a');
            } else if (icon === 'I') {
                box.classList.add('built-b');
            } else if (icon === 'C') {
                box.classList.add('built-c');
            } else if (icon === 'O') {
                box.classList.add('built-d');
            } else {
                box.classList.add('built-e');
            }
            box.classList.add('built');  // Ensure previously built buildings have the 'built' class
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
        image: './images/house.png',
        upkeep: 1,
        profit: 1
    },
    industry: {
        description: 'Each industry generates 2 coins per turn and cost 1 coin per turn to upkeep.',
        icon: 'I',
        image: './images/industry.png',
        upkeep: 1,
        profit: 2
    },
    commercial: {
        description: 'Each commercial generates 3 coins per turn and cost 2 coins per turn to upkeep.',
        icon: 'C',
        image: './images/commercial.png',
        upkeep: 2,
        profit: 3
    },
    park: {
        description: 'Each park costs 1 coin to upkeep',
        icon: 'O',
        image: './images/park.png',
        upkeep: 1,
        profit: 0
    },
    road: {
        description: 'Each unconnected road segment costs 1 coin to upkeep.',
        icon: '*',
        image: './images/road.png',
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
let buildMode = false;
let buildingSelected = false;

function selectBuilding(buildingType) {
    if (!buildingPlacedThisTurn) {
        document.querySelectorAll('.building').forEach(building => {
            building.classList.remove('selected');
        });

        selectedBuilding = buildingType;
        document.getElementById(selectedBuilding).classList.add('selected');
        buildingSelected = true;

    } else {
        alert("You have already placed a building in this turn. End your turn first");
    }
}

function toggleBuildMode() {
    removeDemolishHighlights();
    demolishMode = false;
    if (buildingSelected && !buildingPlacedThisTurn) {
        highlightValidPlacement();
        buildMode = true;

    }
    else if (buildingPlacedThisTurn) {
        alert('You have alredy moved this turn.')
    }
    else {
        alert('Building not selected.')
    }
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
    if (!buildingPlacedThisTurn && selectedBuilding && box.classList.contains('highlight') && buildMode == true) {
        demolishMode = false;
        
        // check if placed building is on the perimeter and expand the grid
        if (isOnPerimeter(index) && !expandedThisTurn) {
            gridState[index] = { type: selectedBuilding, icon: buildings[selectedBuilding].icon };
            expandGrid(gridSize + 10);
            expandedThisTurn = true;
            updateUI();
            buildingPlacedThisTurn = true;
            selectedBuilding = null;

            endTurn();
            return;
        }
        // place the perimeter after expansion if there is an expansion
        if (!gridState[index] || gridState[index].type !== selectedBuilding) {
            // box.textContent = buildings[selectedBuilding].icon;
            const img = document.createElement('img');
            const icon = buildings[selectedBuilding].icon;
            img.src = buildings[selectedBuilding].image;
            img.alt = buildings[selectedBuilding].icon;
            box.innerHTML = '';
            box.appendChild(img);
            box.classList.add(selectedBuilding);
            box.classList.add('built')
            box.classList.remove('built-a', 'built-b', 'built-c', 'built-d', 'built-e');

            // Add the corresponding built-* class
            if (icon === 'R') {
                box.classList.add('built-a');
            } else if (icon === 'I') {
                box.classList.add('built-b');
            } else if (icon === 'C') {
                box.classList.add('built-c');
            } else if (icon === 'O') {
                box.classList.add('built-d');
            } else {
                box.classList.add('built-e');
            }

            gridState[index] = { type: selectedBuilding, icon: buildings[selectedBuilding].icon };

            updateUI();

            buildingPlacedThisTurn = true;
            endTurn();
            selectedBuilding = null;
        }

        clearHighlights(); // Clear previous highlights
    } else if (!selectedBuilding) {
        alert("No building selected");
    } else if (!box.classList.contains('highlight')) {
        alert('Build mode is not enabled.')
    } else if (!buildMode) {
        alert('Build mode is not enabled.')
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
    calculateCoins();
    clearHighlights(); // Clear previous highlights
    console.log('end turn')
}

function updateUI() {
    document.querySelectorAll('.building').forEach(building => {
        building.classList.remove('selected');
    });
}
function showFinances() {
    let totalProfit = 0;
    let totalUpkeep = 0;
    let buildingCounts = {
        residential: 0,
        industry: 0,
        commercial: 0,
        park: 0,
        road: 0
    };

    const visited = new Set();
    const residentialClusters = new Set();

    // Helper function to perform DFS and find all connected residential buildings
    function dfs(index, buildingType) {
        const stack = [index];
        const cluster = new Set();

        while (stack.length > 0) {
            const currentIndex = stack.pop();
            if (visited.has(currentIndex)) continue;
            visited.add(currentIndex);
            cluster.add(currentIndex);

            const adjacents = getAdjacentsByIndex(currentIndex);
            for (const adjIndex of adjacents) {
                if (gridState[adjIndex] && gridState[adjIndex].type === buildingType && !visited.has(adjIndex)) {
                    stack.push(adjIndex);
                }
            }
        }

        return cluster;
    }

    // Helper function to find all isolated road segments
    function findIsolatedRoads() {
        const isolatedRoads = new Set();

        for (let i = 0; i < gridState.length; i++) {
            if (gridState[i] && gridState[i].type === 'road' && !visited.has(i)) {
                const roadCluster = dfs(i, 'road');
                // Check if the road cluster is isolated
                let isConnectedToOtherRoad = false;
                for (const index of roadCluster) {
                    const adjacents = getAdjacentsByIndex(index);
                    for (const adjIndex of adjacents) {
                        if (roadCluster.has(adjIndex)) {
                            isConnectedToOtherRoad = true;
                            break;
                        }
                    }
                    if (isConnectedToOtherRoad) break;
                }
                if (!isConnectedToOtherRoad) {
                    isolatedRoads.add(i);
                }
                roadCluster.forEach(index => visited.add(index));
            }
        }

        return isolatedRoads;
    }

    // Iterate over the gridState to calculate profit and upkeep
    for (let i = 0; i < gridState.length; i++) {
        const building = gridState[i];
        if (building) {
            const buildingType = building.type;
            buildingCounts[buildingType]++;
            totalProfit += buildings[buildingType].profit;

            if (buildingType === 'residential' && !visited.has(i)) {
                // Find all connected residential buildings to form a cluster
                const cluster = dfs(i, 'residential');
                residentialClusters.add(cluster); // Add the cluster to set of residential clusters
                cluster.forEach(index => visited.add(index));
            } else if (buildingType !== 'road') {
                // Other building types or already visited residential buildings
                totalUpkeep += buildings[buildingType].upkeep;
            }
        }
    }

    // Calculate upkeep for residential clusters
    let totalResidentialUpkeep = 0;
    residentialClusters.forEach(cluster => {
        if (cluster.size > 1) {
            totalResidentialUpkeep += buildings.residential.upkeep;
        }
    });

    // Calculate upkeep for isolated road segments
    const isolatedRoads = findIsolatedRoads();
    totalUpkeep += isolatedRoads.size * buildings.road.upkeep;

    // Generate HTML content for the finances information
    let financesInfo = '<table class="finances-table">';
    financesInfo += '<tr><th>Building</th><th>Count</th><th>Profit</th><th>Upkeep</th></tr>';
    for (let type in buildingCounts) {
        financesInfo += `<tr>
                            <td>${type.charAt(0).toUpperCase() + type.slice(1)}</td>
                            <td>${buildingCounts[type]}</td>
                            <td>${buildingCounts[type] * buildings[type].profit}</td>
                            <td>${type === 'residential' ? totalResidentialUpkeep : type === 'road' ? isolatedRoads.size * buildings[type].upkeep : buildingCounts[type] * buildings[type].upkeep}</td>
                         </tr>`;
    }
    financesInfo += `<tr>
                        <td>Total</td>
                        <td></td>
                        <td>${totalProfit}</td>
                        <td>${totalUpkeep}</td>
                     </tr>`;
    financesInfo += '</table>';

    // Display the finances information in the modal
    document.getElementById('finances-info').innerHTML = financesInfo;
    document.getElementById('finances-modal').style.display = 'block';
}








function closeFinancesModal() {
    document.getElementById('finances-modal').style.display = 'none';
}



function toggleDemolishMode() {
    clearHighlights(); // Clear previous highlights
    if (!buildingPlacedThisTurn){
        demolishMode = !demolishMode;
        highlightDemolishableBuildings();
        const demolishButton = document.getElementById('demolish-btn');
        if (demolishMode) {
            demolishButton.classList.add('active');
        } else {
            demolishMode = false;
            demolishButton.classList.remove('active');
            removeDemolishHighlights();

        }
    }
    else {
        alert('You have already moved this turn.')
    }
}

function highlightDemolishableBuildings() {
    const gridSquares = document.querySelectorAll('.grid-box');
    gridSquares.forEach(box => {
        if (box.classList.contains('built')) {
            box.classList.add('highlight-demolish');
        }
    });
}

function removeDemolishHighlights() {
    document.querySelectorAll('.grid-box').forEach(box => {
        box.classList.remove('highlight-demolish');
    });
}

function demolishBuilding(box, index) {
    if (gridState[index] && !buildingPlacedThisTurn) {
        box.textContent = '';
        box.classList.remove('built');
        box.classList.remove('built', 'built-a', 'built-b', 'built-c', 'built-d', 'built-e', 'highlight', 'highlight-demolish');
        box.classList.remove(gridState[index].type);
        removeDemolishHighlights();
        demolishMode = false; // Exit demolish mode
        gridState[index] = null;
        buildingPlacedThisTurn = true;
        endTurnWithoutScoreUpdate()        
    }
    else if (buildingPlacedThisTurn) {
        alert('You have already moved this turn. End a turn.')
    }
}

function endTurnWithoutScoreUpdate() {
    turnNumber++;
    document.getElementById('turn').textContent = turnNumber;
    buildingPlacedThisTurn = false;
    expandedThisTurn = false;
    calculateCoins();
    clearHighlights(); // Clear previous highlights
    console.log('end turn without score update')
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

function calculateCoins() {
    let totalProfit = 0;
    let totalUpkeep = 0;

    const residentialClusters = new Set();
    const visited = new Set();

    // Helper function to perform DFS and find all connected residential buildings
    function dfs(index) {
        const stack = [index];
        const cluster = new Set();

        while (stack.length > 0) {
            const currentIndex = stack.pop();
            if (visited.has(currentIndex)) continue;
            visited.add(currentIndex);
            cluster.add(currentIndex);

            const adjacents = getAdjacentsByIndex(currentIndex);
            for (const adjIndex of adjacents) {
                if (gridState[adjIndex] && gridState[adjIndex].type === 'residential' && !visited.has(adjIndex)) {
                    stack.push(adjIndex);
                }
            }
        }

        return cluster;
    }

    // Helper function to find all connected roads
    function dfsRoad(index) {
        const stack = [index];
        const roadCluster = new Set();

        while (stack.length > 0) {
            const currentIndex = stack.pop();
            if (visited.has(currentIndex)) continue;
            visited.add(currentIndex);
            roadCluster.add(currentIndex);

            const adjacents = getAdjacentsByIndex(currentIndex);
            for (const adjIndex of adjacents) {
                if (gridState[adjIndex] && gridState[adjIndex].type === 'road' && !visited.has(adjIndex)) {
                    stack.push(adjIndex);
                }
            }
        }

        return roadCluster;
    }

    // Iterate over the gridState to calculate profit and upkeep
    for (let i = 0; i < gridState.length; i++) {
        const building = gridState[i];
        if (building) {
            const buildingType = building.type;

            // Calculate profit for each building type
            totalProfit += buildings[buildingType].profit;

            if (buildingType === 'residential' && !visited.has(i)) {
                // Find all connected residential buildings to form a cluster
                const cluster = dfs(i);

                // Only add the upkeep once for each cluster if it contains more than one residential building
                if (cluster.size > 1) {
                    residentialClusters.add([...cluster][0]);
                    totalUpkeep += buildings.residential.upkeep;
                }
            } else if (buildingType === 'road' && !visited.has(i)) {
                // Find all connected roads to form a cluster
                const roadCluster = dfsRoad(i);

                // Only add the upkeep if it's a single unconnected road segment
                if (roadCluster.size === 1) {
                    totalUpkeep += buildings.road.upkeep;
                }
            } else if (buildingType !== 'residential' && buildingType !== 'road') {
                totalUpkeep += buildings[buildingType].upkeep;
            }
        }
    }

    let income = totalProfit-totalUpkeep;
    document.getElementById('total-income').textContent = income;

    const incomeBox = document.querySelector('.income-box');

    
    if (income < 0){
        document.getElementById('income-status').textContent = "Loss";
        incomeBox.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    }
    else if (income == 0) {
        document.getElementById('income-status').textContent = "Neutral";
        incomeBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    }
    else {
        document.getElementById('income-status').textContent = "Profit";
        incomeBox.style.backgroundColor = 'rgba(0, 255, 64, 0.7)';
    }



    console.log(`Total Profit: ${totalProfit}, Total Upkeep: ${totalUpkeep}`);
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

const apikey = '668e26d5a7d61d10485c21a2'
const apiurl = 'https://pookiebears-8bfa.restdb.io/rest/'


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
    
    let now = new Date();

    // Get the current time in milliseconds since the epoch
    let timeInMs = now.getTime();

    // Get the timezone offset in milliseconds for Singapore (UTC+8)
    let singaporeOffset = 8 * 60 * 60 * 1000;

    // Create a new Date object with the adjusted time
    let singaporeTime = new Date(timeInMs + singaporeOffset);

    // Format the date and time in ISO 8601 format
    let singaporeISOString = singaporeTime.toISOString().replace('Z', '+08:00');

    const username = document.getElementById('username-input').value;

    const savegameData = {
        username: username,
        datetimeCreated: singaporeISOString,
        gamestate: jsonGameState
    };

    const postSaveData = {
        "async": true,
        "crossDomain": true,
        "url": apiurl + "freeplay-saves",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-apikey": apikey,
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(savegameData)
    };

    const leaderboardData = {
        name: username,
        score: points
    }

    var postLeaderboard = {
        "async": true,
        "crossDomain": true,
        "url": apiurl + "freeplayleaderboard",
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "x-apikey": apikey,
          "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(leaderboardData)
    };
      
    $.ajax(postLeaderboard).done(function (response) {
    console.log(response);
    });


    $.ajax(postSaveData).done(function(response) {
        console.log(response);
        alert("Game saved successfully!");
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error saving game:", textStatus, errorThrown);
        alert("Failed to save game. Please try again.");
    });
}


function fetchGameStateFromDB() {
    const username = document.getElementById('username-input').value;

    if (!username) {
        alert("Please enter a username first.");
        return;
    }

    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": apiurl + `freeplay-saves?q={%22username%22:%22${username}%22}`,
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "x-apikey": apikey,
            "cache-control": "no-cache"
        },
        success: function(response) {
            if (response.length === 0) {
                alert("No save data found for this username.");
                return;
            }
        
            // The response[0].gamestate might already be a JavaScript object
            let gameState;
            try {
                gameState = typeof response[0].gamestate === "string" ? JSON.parse(response[0].gamestate) : response[0].gamestate;
            } catch (error) {
                console.error("Error parsing game state:", error);
                alert("Failed to parse game state. Please try again.");
                return;
            }

            console.log
        
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
        },
        
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error fetching game state:", textStatus, errorThrown);
            alert("Failed to load game. Please try again.");
        }
    });
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

// Example highlight functionality
function highlightSquare(square) {
    square.classList.add('highlight');
}

function removeHighlight(square) {
    square.classList.remove('highlight');
}

// Event listeners to handle building and demolishing
document.querySelectorAll('.grid-box').forEach(square => {
    square.addEventListener('click', () => {
        if (demolishMode) {
            demolishBuilding(square);
        } else {
            placeBuilding(square);
        }
    });

    square.addEventListener('mouseover', () => {
        if (!square.classList.contains('built')) {
            highlightSquare(square);
        }
    });

    square.addEventListener('mouseout', () => {
        removeHighlight(square);
    });
});

document.getElementById('pause').addEventListener('click', () => {
    document.getElementById('exitModal').style.display = 'block';
  });
  
  document.getElementById('yesBtn').addEventListener('click', () => {
    window.location.href = 'start.html';
  });
  
  document.getElementById('noBtn').addEventListener('click', () => {
    document.getElementById('exitModal').style.display = 'none';
  });