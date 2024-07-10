let navTrigger = document.getElementsByClassName("nav-trigger")[0];
body = document.getElementsByTagName("body")[0];

navTrigger.addEventListener("click", function () {
  event.preventDefault();
  body.classList.toggle("nav-open");
});

//Grid//
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const gridSize = 20; // Change this value to adjust the grid size
  let zoomLevel = 1;

  // Set the CSS grid template rows and columns dynamically
  grid.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`; // 40px is the fixed width of each square
  grid.style.gridTemplateRows = `repeat(${gridSize}, 40px)`; // 40px is the fixed height of each square

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

  // Show start-load modal, hide username modal first
  const startLoadModal = document.getElementById("start-load-modal");
  const usernameModal = document.getElementById('username-modal');
  const startGameButton = document.getElementById('start-game-button');

  const submitUsernameButton = document.getElementById('submit-username-button');

  startGameButton.addEventListener('click', () => {
      // const username = document.getElementById('username-input').value;
      // if (username) {
          // Store the username or display it in the UI if needed
          // console.log("Username:", username);
      startLoadModal.style.display = 'none'; // Hide the modal
      // } else {
      //     alert("Please enter a username");
      //}
  });

  document.getElementById('load-game-button').addEventListener('click', fetchGameStateFromDB);
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
    image: "./images/house.png",
  },
  industry: {
    description:
      "Industry (I): Scores 1 point per industry in the city. Each industry generates 1 coin per residential building adjacent to it.",
    icon: "I",
    image: "./images/industry.png",
  },
  commercial: {
    description:
      "Commercial (C): Scores 1 point per commercial adjacent to it. Each commercial generates 1 coin per residential adjacent to it.",
    icon: "C",
    image: "./images/commercial.png",
  },
  park: {
    description: "Park (O): Scores 1 point per park adjacent to it.",
    icon: "O",
    image: "./images/park.png",
  },
  road: {
    description:
      "Road (*): Scores 1 point per connected road (*) in the same row.",
    icon: "*",
    image: "./images/road.png",
  },
};

let selectedBuilding = null;
let selectedBuildings = [];
let points = 0;
let coins = 16;
let turnNumber = 1;
let firstBuildingPlaced = false;
let demolishMode = false;

function updateScoreboard() {
  document.getElementById("score-counter").innerText = points;
  document.getElementById("coins-counter").innerText = coins;
}

function updateTurnCounter() {
  document.getElementById("turn-counter").innerText = `${turnNumber}`;
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
      img.src = buildings[selectedBuilding].image;
      img.alt = buildings[selectedBuilding].icon;
      square.innerHTML = '';
      square.appendChild(img);
      square.classList.add('built');
      square.classList.remove('highlight');
      square.icon = img.alt;
      square.turnNumber = turnNumber; // Store the turn number when the building was placed

      coins -= 1;

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
    if (square.classList.contains("built") && isOuterLayer(square)) {
      square.classList.add("highlight-demolish");
    }
  });
}

// Check if the building is on the outer layer
function isOuterLayer(square) {
  const neighbors = getNeighbors(square);
  return neighbors.some((neighbor) => !neighbor.classList.contains("built"));
}

// Demolish a building
function demolishBuilding(square) {
  if (coins > 0 && demolishMode && square.classList.contains('built') && isOuterLayer(square)) {
      // Remove building
      square.innerText = '';
      square.classList.remove('built', 'highlight-demolish');
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

function endTurn() {
    // updateProfitAndUpkeep();
    updatePoints();

    turnNumber += 1;
    updateTurnCounter();
    // Check if all squares are used
    const allSquaresUsed = Array.from(document.querySelectorAll('.grid-square')).every(square => square.classList.contains('built'));

    updateScoreboard();

    if (allSquaresUsed) {
        // Perform actions to end the game
        alert(`All squares are used. Game Over! Your final score is: ${points}!`);
        window.location.href = '../index.html';
        // getUserScore() returns the current user's score
        // getLeaderboardScores() returns an array of scores sorted from highest to lowest
        const userScore = getUserScore();
        const leaderboardScores = getLeaderboardScores();

        if (leaderboardScores.length >= 10 && userScore > leaderboardScores[9]) { // Assuming the scores are 0-indexed
            // Show the username modal
            const usernameModal = document.getElementById('username-modal');
            usernameModal.style.display = 'block'; // Make sure to display the modal

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
        } else {
            // If the user's score is not greater than the 10th place, you might want to hide the modal or take some other action
            document.getElementById('username-modal').style.display = 'none';
        }

        document.getElementById('load-game-button').addEventListener('click', fetchGameStateFromDB);
    }
    else if (coins <= 0) {
        alert(`You ran out of coins. Game Over! Your final score is: ${points}!`);
        window.location.href = '../index.html';
    }
}

function saveScore(username, score) {
  const url = "https://pookiebears-04f9.restdb.io/rest/arcadeleaderboard";
  const apikey = "6686c097e0ddd887ed0940e1";

  const data = {
    name: username,
    score: score,
  };

  const settings = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": apikey,
      "cache-control": "no-cache",
    },
    body: JSON.stringify(data),
  };

  fetch(url, settings)
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

function getLeaderboardScores() {
  const url = "https://pookiebears-04f9.restdb.io/rest/arcadeleaderboard";
  const apikey = "6686c097e0ddd887ed0940e1";
  let settings = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": apikey,
      "cache-control": "no-cache",
    },
  };

  return fetch(url, settings)
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

  // // no score to be added if industry is placed before this new adjacent building
  // if (square.adjacentIndustryPlaced) {
  //     return score; 
  // }

  let earliestIndustryTurnNumber = 99999; // hardcoding but whatever LOL

  // Filter squares with buildings and sort by turn number
  const neighborBuildings = neighbors.filter(square => square.icon).sort((a, b) => a.turnNumber - b.turnNumber);

  // check if any adjacent industry is placed
  neighborBuildings.forEach(neighbor => {

      if (neighbor.icon == 'I') {
          earliestIndustryTurnNumber = neighbor.turnNumber;
          score += 1; // only 1 point given if industry is placed  
      } else if ((neighbor.icon == 'R' || neighbor.icon == 'C') && neighbor.turnNumber < earliestIndustryTurnNumber) { 
          score += 1;
      } else if (neighbor.icon == 'O' && neighbor.turnNumber < earliestIndustryTurnNumber) {
          score += 2;
      }
  });

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

function saveGame() {
  alert("Game saved!");

  // TBC
}

function exitGame() {
  window.location.href = "../index.html";
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

window.onload = initializeGame;
