let navTrigger = document.getElementsByClassName('nav-trigger')[0];
body = document.getElementsByTagName('body')[0];

navTrigger.addEventListener('click', function() {
    event.preventDefault();
    body.classList.toggle('nav-open');
});



//Grid//
const grid = document.getElementById("grid");
let lockGame = false;
// Set test mode to true if you want see mines location
const testMode = false;
generateGrid();

// Generate 10 * 10 Grid
function generateGrid() {
    lockGame = false;
    grid.innerHTML = "";
    for (var i = 0; i < 10; i++) {
        row = grid.insertRow(i);
        for (var j = 0; j < 10; j++) {
            cell = row.insertCell(j);
            cell.onclick = function () { init(this); };
            var mine = document.createAttribute("mine");
            mine.value = "false";
            cell.setAttributeNode(mine);
        }
    }
    //generateMines();
}


// Changing layout between construction and finances
document.addEventListener('DOMContentLoaded', function() {
    let financesButton = document.querySelector('#financesBtn');
    let constructionButton = document.querySelector('#constructionBtn');
    let finances = document.querySelector('.finances');
    let construction = document.querySelector('.construction');

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


// Assume we have predefined arrays or functions that handle game logic
let currentTurn = 1;
let score = 0;
let coins = 16;

function saveGame() {
    // Save game state logic
    alert("Game Saved!");
}

function exitGame() {
    // Exit game logic
    alert("Exiting Game!");
}

function selectBuilding(buildingId) {
    // Highlight the selected building and show its description
    const building = document.getElementById(buildingId);
    const buildingType = document.getElementById(`${buildingId}-type`).innerText;
    const descriptionText = document.getElementById('description-text');

    // Add logic to handle building selection
    descriptionText.innerText = `${buildingType} selected.`;
}

function buildStructure() {
    // Logic to build the selected structure
    // Deduct coin, place building on the grid, update score
    coins -= 1;
    score += 1; // Update based on actual scoring logic

    document.getElementById('coins').innerText = coins;
    document.getElementById('score').innerText = score;

    alert("Structure Built!");
}

function enterDemolishMode() {
    // Logic for demolish mode
    alert("Demolish Mode Activated!");
}



// // Generate mines randomly
// function generateMines() {
//     // Add 20 mines to game
//     for (var i = 0; i < 20; i++) {
//         var row = Math.floor(Math.random() * 10);
//         var col = Math.floor(Math.random() * 10);
//         var cell = grid.rows[row].cells[col];
//         cell.setAttribute("mine", "true");
//         if (testMode) {
//             cell.innerHTML = "X";
//         }
//     }
// }

// // Highlight all mines red
// function revealMines() {
//     for (var i = 0; i < 10; i++) {
//         for (var j = 0; j < 10; j++) {
//             var cell = grid.rows[i].cells[j];
//             if (cell.getAttribute("mine") == "true") {
//                 cell.className = "mine";
//             }
//         }
//     }
// }

// function checkGameComplete() {
//     var gameComplete = true;
//     for (var i = 0; i < 10; i++) {
//         for (var j = 0; j < 10; j++) {
//             if ((grid.rows[i].cells[j].getAttribute("mine") == "false") && (grid.rows[i].cells[j].innerHTML == "")) {
//                 gameComplete = false;
//             }
//         }
//     }
//     if (gameComplete) {
//         alert("You Found All Mines!");
//         revealMines();
//     }
// }

// function init(cell) {
//     // Check game completed or no
//     if (lockGame) {
//         return;
//     } else {
//         // Check user clicked on mine
//         if (cell.getAttribute("mine") == "true") {
//             revealMines();
//             lockGame = true;
//         } else {
//             cell.className = "active";
//             // Display number of mines around cell
//             var mineCount = 0;
//             var cellRow = cell.parentNode.rowIndex;
//             var cellCol = cell.cellIndex;
//             for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
//                 for (var j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) {
//                     if (grid.rows[i].cells[j].getAttribute("mine") == "true") {
//                         mineCount++;
//                     }
//                 }
//             }
//             cell.innerHTML = mineCount;
//             if (mineCount == 0) {
//                 // if cell don't have mine
//                 for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
//                     for (var j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) {
//                         if (grid.rows[i].cells[j].innerHTML == "") {
//                             init(grid.rows[i].cells[j]);
//                         }
//                     }
//                 }
//             }
//             checkGameComplete();
//         }
//     }

// }