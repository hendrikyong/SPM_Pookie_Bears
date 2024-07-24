let navTrigger = document.getElementsByClassName("nav-trigger")[0];
body = document.getElementsByTagName("body")[0];

navTrigger.addEventListener("click", function () {
  event.preventDefault();
  body.classList.toggle("nav-open");
});

//Grid//
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const gridSize = 5; // Change this value to adjust the grid size
  let zoomLevel = 1;

  // Set the CSS grid template rows and columns dynamically
  grid.style.gridTemplateColumns = `repeat(${gridSize}, 150px)`; // 40px is the fixed width of each square
  grid.style.gridTemplateRows = `repeat(${gridSize}, 150px)`; // 40px is the fixed height of each square

  // Create the grid squares
  for (let m = 0; m < gridSize; m++) {
    for (let i = 0; i < gridSize; i++) {
      const square = document.createElement("div");
      // square.textContent = `${i},${m}`; // Display the coordinates of the square
      square.classList.add("grid-square");
      square.addEventListener("click", () => {
        if (demolishMode) {
          demolishBuilding(square);
        } else {
          placeBuilding(square);
        }
      });
      grid.appendChild(square);
    }
  }

  selectedBuilding = null;
  selectedBuildings = [];
  points = 0;
  coins = 8;
  turnNumber = 0;
  firstBuildingPlaced = false;
  demolishMode = false;

  initializeGame(); // Initialize the game here to ensure the initial buildings are selected
  // Zoom In and Zoom Out functionality
  document.getElementById("zoom-in").addEventListener("click", () => {
    zoomLevel = Math.min(0.9, zoomLevel + 0.1); // Prevent zooming out too much
    // zoomLevel += 0.1;
    console.log(zoomLevel);
    grid.style.transform = `scale(${zoomLevel})`;
    //grid.style.transformOrigin = '0 0';
  });

  document.getElementById("zoom-out").addEventListener("click", () => {
    console.log(zoomLevel);
    zoomLevel = Math.max(0.4, zoomLevel - 0.1); // Prevent zooming out too much
    grid.style.transform = `scale(${zoomLevel})`;
    //grid.style.transformOrigin = '0 0';
  });

  fetchGameStateFromDB();
});

// Changing layout between construction and finances
document.addEventListener("DOMContentLoaded", function () {
  let financesButton = document.querySelector("#financesBtn");
  let constructionButton = document.querySelector("#constructionBtn");
  let finances = document.querySelector(".finances");
  let construction = document.querySelector("#container");

  financesButton.addEventListener("click", function () {
    console.log("Finances button clicked");
    finances.classList.remove("hidden");
    construction.classList.add("hidden");
  });

  constructionButton.addEventListener("click", function () {
    console.log("Construction button clicked");
    construction.classList.remove("hidden");
    finances.classList.add("hidden");
  });
});

//code
const buildings = {
  residential: {
    description:
      "Residential (R): If it is next to an industry (I), then it scores 1 point only. Otherwise, it scores 1 point for each adjacent residential (R) or commercial (C), and 2 points for each adjacent park (O).",
    icon: "R",
    image: "../images/house.png",
  },
  industry: {
    description:
      "Industry (I): Scores 1 point per industry in the city. Each industry generates 1 coin per residential building adjacent to it.",
    icon: "I",
    image: "../images/industry.png",
  },
  commercial: {
    description:
      "Commercial (C): Scores 1 point per commercial adjacent to it. Each commercial generates 1 coin per residential adjacent to it.",
    icon: "C",
    image: "../images/commercial.png",
  },
  park: {
    description: "Park (O): Scores 1 point per park adjacent to it.",
    icon: "O",
    image: "../images/park.png",
  },
  road: {
    description:
      "Road (*): Scores 1 point per connected road (*) in the same row.",
    icon: "*",
    image: "../images/road.png",
  },
};

let selectedBuilding;
let selectedBuildings;
let points;
let coins;
let turnNumber;
let firstBuildingPlaced;
let demolishMode;
let savingScoreToLeaderboard = false;

function updateScoreboard() {
  document.getElementById("score-counter").innerText = points;
  document.getElementById("coins-counter").innerText = coins;
}

function updateTurnCounter() {
  document.getElementById("turn").innerText = `${turnNumber}`;
}

function selectBuilding(buildingType) {
  console.log("Selected building: ", buildingType);
  if (!selectedBuildings.includes(buildingType)) return;

  // Remove the 'selected' class from all buildings
  document.querySelectorAll(".building").forEach((building) => {
    building.classList.remove("selected");
  });

  // Add the 'selected' class to the clicked building
  document.getElementById(buildingType).classList.add("selected");
  selectedBuilding = buildingType;

  // Update the description
  document.getElementById("description-text").innerText =
    buildings[buildingType].description;
}

function getRandomBuilding(exclude) {
    const buildingKeys = Object.keys(buildings).filter(key => key !== exclude && !selectedBuildings.includes(key));
    const randomIndex = Math.floor(Math.random() * buildingKeys.length);
    return buildingKeys[randomIndex];
}

function initializeGame() {
    updateTurnCounter();
    const firstRandomBuilding = getRandomBuilding(null)
    selectedBuildings = [firstRandomBuilding, getRandomBuilding(firstRandomBuilding)];
    updateSelectedBuildingsUI();
    updateScoreboard();
}

function updateSelectedBuildingsUI() {
  document.querySelectorAll(".building").forEach((building) => {
    if (!selectedBuildings.includes(building.id)) {
      building.classList.add("disabled");
    } else {
      building.classList.remove("disabled");
    }
    building.classList.remove("selected");
  });

  // Automatically select the first available building
  selectBuilding(selectedBuildings[0]);
}

function highlightValidCells() {
  const gridSquares = document.querySelectorAll('.grid-square');

  console.log("First building placed: ", firstBuildingPlaced);

  for (let i = 0; i < gridSquares.length; i++) {
      const square = gridSquares[i];
      if (square.classList.contains('built')) continue;

      square.classList.remove('highlight');
      if (firstBuildingPlaced) {
          const neighbors = getNeighbors(square);
          if (neighbors.some(neighbor => neighbor.classList.contains('built'))) {
              square.classList.add('highlight');
          }
      } else {
          square.classList.add('highlight');
      }
  }
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
    alert("Please select a building type first.");
  }
}

function placeBuilding(square) {
  if (square.classList.contains('highlight') && coins > 0) {
      const img = document.createElement('img');
      const icon = buildings[selectedBuilding].icon;
      img.src = buildings[selectedBuilding].image;
      img.alt = buildings[selectedBuilding].icon;
      square.innerHTML = '';
      square.appendChild(img);
      square.classList.add('built');
      square.classList.remove('highlight');
      square.icon = img.alt;
      square.turnNumber = turnNumber; // Store the turn number when the building was placed
      square.classList.remove('built-a', 'built-b', 'built-c', 'built-d', 'built-e');

      coins -= 1;

      // Add the corresponding built-* class
      if (icon === 'R') {
        square.classList.add('built-a');
      } else if (icon === 'I') {
          square.classList.add('built-b');
      } else if (icon === 'C') {
          square.classList.add('built-c');
      } else if (icon === 'O') {
          square.classList.add('built-d');
      } else {
          square.classList.add('built-e');
      }

      // if commercial or industrial building is added
      if (square.icon == 'I' || square.icon == 'C') {
          addCoin();
      }

      if (!firstBuildingPlaced) {
          firstBuildingPlaced = true;
      }

      // Remove highlight from all cells
      document.querySelectorAll('.grid-square').forEach(square => {
          square.classList.remove('highlight');
      });

      // Update selected buildings for next turn
      const newBuilding = getRandomBuilding(null);
      const secondNewBuilding = getRandomBuilding(newBuilding);
      selectedBuildings = [newBuilding, secondNewBuilding];

      // Update the UI for new buildings
      updateSelectedBuildingsUI();

      // End the turn and update coins, counter, points 
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
  document.querySelectorAll(".building").forEach((building) => {
    building.classList.remove("selected");
  });
  highlightDemolishableBuildings();
}

// Highlight demolishable buildings
function highlightDemolishableBuildings() {
  const gridSquares = document.querySelectorAll(".grid-square");
  gridSquares.forEach((square) => {
    if (square.classList.contains("built")) {
      square.classList.add("highlight-demolish");
    }
  });
}

// Demolish a building
function demolishBuilding(square) {
  if (coins > 0 && demolishMode && square.classList.contains('built')) {
      // Remove building
      square.innerText = '';
      // square.classList.remove('built', 'highlight-demolish');
      square.classList.remove('built', 'built-a', 'built-b', 'built-c', 'built-d', 'built-e', 'highlight', 'highlight-demolish');
      square.icon = null;
      square.turnNumber = null;

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
      // Exit demolish mode
      demolishMode = false;
      removeDemolishHighlights();
  }
}

// Remove highlight from all cells
function removeDemolishHighlights() {
  document.querySelectorAll(".grid-square").forEach((square) => {
    square.classList.remove("highlight-demolish");
  });
}

function removeBuildHighlights() {
  document.querySelectorAll(".grid-square").forEach((square) => {
    square.classList.remove("highlight");
  });
}

async function endTurn() {
    // updateProfitAndUpkeep();
    updatePoints();

    turnNumber += 1;

    updateTurnCounter();
    // Check if all squares are used
    const allSquaresUsed = Array.from(document.querySelectorAll('.grid-square')).every(square => square.classList.contains('built'));

    updateScoreboard();

    console.log(coins + " total coins");
    if (allSquaresUsed) {
        // Perform actions to end the game
        // getLeaderboardScores() returns an array of scores sorted from highest to lowest
        const userScore = points;
        const leaderboardScores = await getLeaderboardScores();

        if (leaderboardScores.length < 10) {
          await saveScoreToLeaderboard(localStorage.getItem("username"), points);
          alert("Congratulations! You have made it to the leaderboard!");
          window.location.href = './menu.html';
        }

        console.log(leaderboardScores[9]);
        console.log(leaderboardScores.length);
        console.log(userScore);

        if (userScore > leaderboardScores[9]) { // Assuming the scores are 0-indexed
          await saveScoreToLeaderboard(localStorage.getItem("username"), points);
          alert("Congratulations! You have made it to the leaderboard!");
        } 
        alert(`All squares are used. Game Over! Your final score is: ${points}!`);
        window.location.href = './menu.html';
    }
    else if (coins <= 0) {

        // getLeaderboardScores() returns an array of scores sorted from highest to lowest
        const userScore = points;
        const leaderboardScores = await getLeaderboardScores();

        if (leaderboardScores.length < 10) {
          await saveScoreToLeaderboard(localStorage.getItem("username"), points);
          alert("Congratulations! You have made it to the leaderboard!");
          window.location.href = './menu.html';
        }

        console.log(leaderboardScores[9]);  
        console.log(leaderboardScores.length);
        console.log(userScore);

        if (userScore > leaderboardScores[9]) { // Assuming the scores are 0-indexed
          await saveScoreToLeaderboard(localStorage.getItem("username"), points);
          alert("Congratulations! You have made it to the leaderboard!");
          window.location.href = './menu.html';
        } 

        alert(`You ran out of coins. Game Over! Your final score is: ${points}!`);
        window.location.href = './menu.html';
    }
}

const apiKey = "66a11886a412941752383803";
const specificDB= 'ea23'
const databaseUrl = "https://pookiebears-" + specificDB + ".restdb.io/rest/";

async function saveScoreToLeaderboard(username, score) {
  const url = databaseUrl + "beginner-arcadeleaderboard";

  const data = {
    name: username,
    score: score,
  };

  const settings = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
    body: JSON.stringify(data),
  };

  await fetch(url, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response was not ok");
      }
    })
    .then((data) => {
      console.log("Score saved successfully:", data);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

async function getLeaderboardScores() {
  const url = databaseUrl + "beginner-arcadeleaderboard";
  let settings = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
  };

  return await fetch(url, settings)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      let userScoresMap = new Map();

      // Process the data to ensure each user's highest score is considered
      data.forEach((user) => {
        if (!userScoresMap.has(user.name) || userScoresMap.get(user.name) < user.score) {
          userScoresMap.set(user.name, user.score);
        }
      });

      // Convert the map to an array of scores
      let scores = Array.from(userScoresMap.values());

      // Sort the scores in descending order
      scores.sort((a, b) => b - a);

      return scores;
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
      return []; // Return an empty array in case of error
    });
}
function fetchGameStateFromDB() {
  // Retrieve currentSaveSlot from local storage
  const currentSaveSlot = JSON.parse(localStorage.getItem('currentSaveSlot'));

  if (!currentSaveSlot) {
      alert("No save slot selected.");
      window.location.href = "./beginner-arcade-saves.html"; // Redirect to the save slots page if no slot is selected
      return;
  }

  // Extract the game state from the save slot data
  const gameState = currentSaveSlot.gamestate;

  if (!gameState) {
      return;
  }

  // Update game variables from the loaded state
  gridSize = gameState.gridSize; // Adjust according to your game state structure
  gridMap = gameState.gridMap; // Use gridMap or gridState based on your structure
  selectedBuildings = gameState.selectedBuildings;
  points = gameState.points;
  coins = gameState.coins;
  turnNumber = gameState.turnNumber;
  demolishMode = gameState.demolishMode;

  // Update the grid with the loaded state
  updateGrid();
  updateScoreboard();
  
  // Update the UI with the loaded values
  document.getElementById('turn').textContent = turnNumber;
  document.getElementById('score').textContent = points;
  document.getElementById('coins').textContent = coins;

  updateTurnCounter();
  updateSelectedBuildingsUI();

}


function updateGrid() {
  const grid = document.getElementById('grid');

  const squares = Array.from(grid.children);
  const rowSize = Math.sqrt(squares.length);

  for (let i = 0; i < rowSize * rowSize; i++) {
      const square = squares[i];
      console.log(gridMap);
      console.log(square);
      console.log(gridMap[i]);

      if (gridMap[i].icon == null) {
        continue;
      }
      const gridSquare = gridMap[i];
      console.log(gridSquare);
      square.innerHTML = '';
          const img = document.createElement('img');
          console.log(buildings['commercial'].image);
          if (gridSquare.icon == 'R') {
            img.src = buildings['residential'].image;

          } else if (gridSquare.icon == 'I') {
            img.src = buildings['industrial'].image;

          } else if (gridSquare.icon == 'C') {
            img.src = buildings['commercial'].image;

          } else if (gridSquare.icon == 'O') {
            img.src = buildings['park'].image;

          } else if (gridSquare.icon == '*') {
            img.src = buildings['road'].image;

          }
          img.alt = gridSquare.icon;
          square.appendChild(img);
          square.classList.add('built');
          square.icon = gridSquare.icon;
          square.turnNumber = gridSquare.turnNumber;
          firstBuildingPlaced = true;
          // square.classList.add(`built-${gridSquare.icon.toLowerCase()}`);
  }
}

function updatePoints() {
    oldPoints = points;
    points = 0;

    const gridSquares = document.querySelectorAll('.grid-square');

    gridSquares.forEach(square => {
        if (square.classList.contains('built')) {

            if (square.icon == 'R') {
                points += residentialScoringSystem(square);
            } else if (square.icon == 'I') {
                points += industryScoringSystem();
            } else if (square.icon == 'C') {
                points += commercialScoringSystem(square);
            } else if (square.icon == 'O') {
                points += parkScoringSystem(square);
            } else if (square.icon == '*') {
                points += roadScoringSystem(square);
            }
        }
      });

    if (oldPoints > points) {
        points = oldPoints; // If the points are reduced, revert back to the old points
    }
}

function residentialScoringSystem(square) {
  let score = 0;

  const neighbors = getNeighbors(square);

  let earliestIndustryTurnNumber = 99999; // hardcoding but whatever LOL

  // Filter squares with buildings and sort by turn number
  const neighborBuildings = neighbors.filter(square => square.icon).sort((a, b) => a.turnNumber - b.turnNumber);

  // check if any adjacent industry is placed
  for (const neighbor of neighborBuildings) {
    if (neighbor.icon == 'I') {
        earliestIndustryTurnNumber = neighbor.turnNumber;
        score += 1; // only 1 point given if industry is placed  
    } else if ((neighbor.icon == 'R' || neighbor.icon == 'C') && neighbor.turnNumber < earliestIndustryTurnNumber && neighbor.turnNumber > square.turnNumber) { 
        score += 1;
    } else if (neighbor.icon == 'O' && neighbor.turnNumber < earliestIndustryTurnNumber  && neighbor.turnNumber > square.turnNumber) {
        score += 2;
    }
  }

  console.log(earliestIndustryTurnNumber);
  console.log(score);
  
  return score;
}

// 1 point per industry building
function industryScoringSystem() {
    return score = 1;
}

function commercialScoringSystem(square) {
    let score = 0;
    const neighbors = getNeighbors(square);

    neighbors.forEach(neighbor => {
        if (neighbor.icon == 'C') {
            score += 1; // each adjacent commercial building scores 1 point
        }
    });

    return score;
}

function parkScoringSystem(square) {
    let score = 0;
    const neighbors = getNeighbors(square);

    neighbors.forEach(neighbor => {
        if (neighbor.icon == 'O') {
            score += 1; // each adjacent park building scores 1 point
        }
    });

    return score;
}

function roadScoringSystem(square) {
    let score = 0;
    const neighbors = [];

    const grid = document.getElementById('grid');
    const squares = Array.from(grid.children);
    const index = squares.indexOf(square);
    const rowSize = Math.sqrt(squares.length);

    // Check if the square is not in the first column (left edge)
    if (index % rowSize !== 0) { // left neighbor
        neighbors.push(squares[index - 1]);
    }
    // Check if the square is not in the last column (right edge)
    if (index % rowSize !== rowSize - 1) { // right neighbor
        neighbors.push(squares[index + 1]);
    }

    neighbors.forEach(neighbor => {
        if (neighbor.icon == '*') {
            score += 1; // each adjacent road connected scores 1 point
        }
    });

    return score;
}

function addCoin() {
    coins += 1;
}



async function saveGame() {


  savingScoreToLeaderboard = false;

  

  const grid = document.getElementById('grid');

  const squares = Array.from(grid.children);
  const rowSize = Math.sqrt(squares.length);

      // Gather game state
      const gameState = {
        gridSize: rowSize,
        gridMap: squares,
        selectedBuildings: selectedBuildings,
        points: points,
        coins: coins,
        turnNumber: turnNumber,
        demolishMode: demolishMode,
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

    const username = localStorage.getItem("username");
    const currentSaveSlot = JSON.parse(localStorage.getItem("currentSaveSlot"));

    if (!username) {
        alert("User not logged in.");
        return;
    }

    if (!currentSaveSlot) {
        alert("No save slot selected.");
        return;
    }

    const savegameData = {
        username: username,
        saveSlot: currentSaveSlot.saveSlot,
        datetimeCreated: singaporeISOString,
        gamestate: jsonGameState
    };

        // Check if the save slot already exists
        const saveSlots = JSON.parse(localStorage.getItem("saveSlots")) || [];
        const existingSlot = saveSlots.find(slot => slot.saveSlot === currentSaveSlot.saveSlot);
    
        const method = existingSlot ? "PUT" : "POST";
        const url = existingSlot 
            ? `${databaseUrl}beginner-arcademode-saves/${existingSlot._id}` 
            : databaseUrl + 'beginner-arcademode-saves';
    
        $.ajax({
            async: true,
            crossDomain: true,
            url: url,
            method: method,
            headers: {
                "content-type": "application/json",
                "x-apikey": apiKey,
                "cache-control": "no-cache"
            },
            data: JSON.stringify(savegameData),
            processData: false
        }).done(function(response) {
            console.log(response);
            alert("Game saved successfully!");
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error("Error saving game:", textStatus, errorThrown);
            alert("Failed to save game. Please try again.");
        });
}

function exitGame() {
  alert("Bye bye!");
  window.location.href = "./menu.html";
}

function getNeighbors(square) {
  const grid = document.getElementById('grid');

  const squares = Array.from(grid.children);
  const index = squares.indexOf(square);
  const rowSize = Math.sqrt(squares.length);

  const neighbors = [];

  // Check if the square is not in the first column (left edge)
  if (index % rowSize !== 0) { // left neighbor
      neighbors.push(squares[index - 1]);
  }
  // Check if the square is not in the last column (right edge)
  if (index % rowSize !== rowSize - 1) { // right neighbor
      neighbors.push(squares[index + 1]);
  }
  // Check if the square is not in the first row (top edge)
  if (index >= rowSize) { // top neighbor
      neighbors.push(squares[index - rowSize]);
  }
  // Check if the square is not in the last row (bottom edge)
  if (index < squares.length - rowSize) { // bottom neighbor
      neighbors.push(squares[index + rowSize]);
  }

  return neighbors;
}

// Show the modal
function showModal() {
  document.getElementById("legendModal").style.display = "block";
}

function showHelpModal() {
  document.getElementById("htpModal").style.display = "block";
  showContent("general"); // Show the general tab by default
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
  document
    .querySelector(`[onclick="showContent('${tabName}')"]`)
    .classList.add("active");
}

// Close the modal when clicking outside of it
window.onclick = function (event) {
  var modal = document.getElementById("legendModal");
  if (
    event.target == modal ||
    event.target == document.getElementById("htpModal")
  ) {
    modal.style.display = "none";
    document.getElementById("htpModal").style.display = "none";
  }
};

// Example highlight functionality
function highlightSquare(square) {
  square.classList.add('highlight');
}

function removeHighlight(square) {
  square.classList.remove('highlight');
}

// Event listeners to handle building and demolishing
document.querySelectorAll('.grid-square').forEach(square => {
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
  exitGame();
});

document.getElementById('noBtn').addEventListener('click', () => {
  document.getElementById('exitModal').style.display = 'none';
});

window.onload = initializeGame;