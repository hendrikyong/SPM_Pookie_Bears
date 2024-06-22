// ================ INITIATED CLASSES ================
// These to be placed in a js file that can be accessed by other js files

class Building {
    coordX;
    coordY;
    constructor(type, character){
        this.type = type;
        this.type = character;
    }
    checkSurroundingSpace(){
        let arrayOfSpace = [];

        // Checking of XCoords to append corresponding row coords
        if (this.coordY === 0){
            arrayOfSpace.push([this.coordX + 1, this.coordY]);
        }
        else if (this.coordY === 19){
            arrayOfSpace.push([this.coordX - 1, this.coordY]);
        }
        else{
            arrayOfSpace.push([this.coordX + 1, this.coordY]);
            arrayOfSpace.push([this.coordX - 1, this.coordY]);
        }

        // Checking of YCoords to append corresponding col coords
        if (this.coordY === 0){
            arrayOfSpace.push([this.coordX, this.coordY + 1]);
        }
        else if (this.coordY === 19){
            arrayOfSpace.push([this.coordX, this.coordY - 1]);
        }
        else{
            arrayOfSpace.push([this.coordX, this.coordY + 1]);
            arrayOfSpace.push([this.coordX, this.coordY - 1]);
        }

        return arrayOfSpace;
    }

    pointCalculation() {
        return 0;
    }

    addCoord(coordX, coordY){
        this.coordX = coordX;
        this.coordY = coordY;
    }
}

class Residential extends Building {
    type = "Residential";
    character = "R";

    pointCalculation(map, spacesToCheck){
        let score = 0;
        for (const space of spacesToCheck){
            if (map[space[1]][space[0]] !== undefined){
                let adjBuilding = map[space[1]][space[0]];
                if (adjBuilding.type === "Industry" || adjBuilding.type === "Comercial" || adjBuilding.type === "Residential"){
                    score += 1;
                }
                else if (adjBuilding.type === "Park"){
                    score += 2;
                }
            }
        }
        return score;
    }
}
class Commercial extends Building {
    type = "Commercial";
    character = "C";
    roundsAlive = 0;

    pointCalculation(map, spacesToCheck){
        let score = 0;
        score += this.roundsAlive;
        for (const space of spacesToCheck){
            if (map[space[1]][space[0]] !== undefined){
                let adjBuilding = map[space[1]][space[0]];
                if (adjBuilding.type === "Residential" || adjBuilding.type === "Commercial"){
                    score += 1;
                }
            }
        }
        return score;
    }

    addLife(){
        this.roundsAlive += 1;
    }
}
class Park extends Building {
    type = "Park";
    character = "O";

    pointCalculation(map, spacesToCheck){
        let score = 0;
        for (const space of spacesToCheck){
            if (map[space[1]][space[0]] !== undefined){
                let adjBuilding = map[space[1]][space[0]];
                if (adjBuilding.type === "Park"){
                    score += 1;
                }
            }
        }
        return score;
    }
}
class Road extends Building {
    type = "Road";
    character = "*";

    pointCalculation(map, spacesToCheck){
        let score = 0;
        for (const space of spacesToCheck){
            if (map[space[1]][space[0]] !== undefined){
                let adjBuilding = map[space[1]][space[0]];
                if (adjBuilding.type === "Road"){
                    score += 1;
                }
            }
        }
        return score;
    }
}
class Industry extends Building {
    type = "Industry";
    character = "I";
    roundsAlive = 0;

    pointCalculation(map, spacesToCheck){
        let score = 0;
        score += this.roundsAlive;
        for (const space of spacesToCheck){
            if (map[space[1]][space[0]] !== undefined){
                let adjBuilding = map[space[1]][space[0]];
                if (adjBuilding.type === "Residential"){
                    score += 1;
                }
            }
        }
        return score;
    }

    addLife(){
        this.roundsAlive += 1;
    }
}

// ===================================================

// ==================== FUNCTIONS ====================
// These to be placed in a js file that can be accessed by other js files

const ps = require("prompt-sync");
const prompt = ps();

// Generate two unique buildings
function generateBuildChoices(buildingClasses){
    let randomIndexes = [];
    let randomBuildings = [];

    while (randomIndexes.length !== 2){
        randomIndex = Math.floor(Math.random() * (5))
        if (randomIndexes.includes(randomIndex) === false){
            randomIndexes.push(randomIndex);
        }
    }

    for (const index of randomIndexes) {
        const randomBuildingClass = buildingClasses[index];
        if (randomBuildingClass){
            randomBuildings.push(new randomBuildingClass()); // Create new instance
        }
        else{
            console.error(`Invalid random index: ${index}`)
        }
    }
    return randomBuildings;
}

// Check whether the map is completely filled
function checkIfMapIsFull(map){
    for (const row of map){
        for (const element of row){
            if (element === undefined){
                // Return true if there is an empty value
                return true;
            }
        }
    }
    // Return false when the map is completely filled
    return false;
}

// Print map function and perform operations for the following: 
// 1. Check for available spaces 
// 2. Score calculation 
// Return a dictionary 
function printMap(map){
    let totalPoints = 0
    let arrayOfCoords = [];
    let rowNo = 0;
    let rowHeaders = "   A    B    C    D    E    F    G    H    I    J    K    L    M    N    O    P    Q    R    S    T";
    let rowDivider = "======================================================================================================"
    console.log(`${rowHeaders}\n${rowDivider}`);
    for (const row of map){
        let rowStatement = "||";
        // Checks for buildings in squares
        for (const element of row){
            if (element === undefined){
                rowStatement += " X ||";
            }
            else{
                // Execute operations when there is a building
                rowStatement += ` ${element.character} ||`;
                let tempArray = element.checkSurroundingSpace();
                // Add rounds alive for Industry type
                if (element.type === "Industry"){
                    element.addLife();
                }
                totalPoints += element.pointCalculation(map, tempArray);
                for (let coord of tempArray){
                    if (!arrayOfCoords.includes(coord)){
                        arrayOfCoords.push(coord);
                    }
                }
            }
        }
        console.log(rowStatement += `   ${rowNo}\n${rowDivider}`)
        rowNo += 1;
    }
    let dict = {
        "totalPoints" : totalPoints,
        "availableCoords" : arrayOfCoords
    }
    return dict;
}

// Validates user input and returns unique message
function integerValidator(min, max){
    let userInput = 0;
    while (true){
        try {
            userInput = prompt(`Please enter an option within ${min} - ${max}: `)
            userInput = Number(userInput);
            if (userInput >= min && userInput <= max){
                return userInput;
            }
            else{ 
                console.log("Please ensure that number entered is within range.");
            }
        }
        catch (err){
            console.error(err);
        }
    } 
}

// Validates userInput for column 
function columnValidator(){
    let userInput;
    const stringOfLetters = "ABCDEFGHIJKLMNOPQRST";

    while (true){
        userInput = prompt(`Enter column: `)
        if (userInput.length === 1 && stringOfLetters.includes(userInput)){
            return userInput;
        }
        else{
            console.log("Input is not valid, ensure that an capitalised letter is inputted!");
        }
    }
}

// Checks whether userInputCoords matches one of availableCoords' coords
function isArrayInArray(userInputCoords, availableCoords) {
    for (const array of availableCoords) {
        let isMatch = true;
        for (let i = 0; i < 2; i++) {
            if (userInputCoords[i] !== array[i]) {
            isMatch = false;
            break;
            }
        }
        if (isMatch) {
            return true
        }
    }
    return false;
}

// ===================================================

// ================== MAIN PROGRAM ===================

const buildingClasses = [ Residential, Park, Road, Industry, Commercial ];
let moves = 1;
let map =  [[,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,],
            [,,,,,,,,,,,,,,,,,,,,]];
let totalPoints = 0;

// Loops until every square is occupied
while (checkIfMapIsFull(map)){
    // Display map and moves
    let dict = printMap(map);
    availableCoords = dict["availableCoords"];
    
    console.log("\n//======= Aracade Mode =======//");
    console.log(`           Move: ${moves}`);
    console.log(`           Score: ${dict["totalPoints"]}`);
    console.log("//============================//");
    // User decide to demolish or build a building
    console.log("\nBuild or Demolish? 1 and 2 respectively.")
    let buildOrDemolish = integerValidator(1,2);

    // User decide to demolish
    if (buildOrDemolish === 2){
        while (true){
            console.log("\nEnter X Coordinates");
            let coordsX = columnValidator();
            let newCoordsX = coordsX.charCodeAt(0)-65; // Coverts the alphabet to an index
            
            console.log("\nEnter Y Coordinates");
            let coordsY = integerValidator(1,19);
            if (map[coordsY][newCoordsX] === undefined){
                console.log("There is no building to be demolished!");
            }
            else{
                console.log("\nAre you sure? 0 to confirm demolish and 1 to cancel.")
                let userInput = integerValidator(0,1);
                if (userInput === 0){
                    map[coordsY][newCoordsX] = undefined;
                    break;
                }
                else{
                    break;
                }
            }
        }
    }
    // User decide to build
    else {
        let buildingChoices = generateBuildChoices(buildingClasses);
        console.log(`\nBuidling choices: \n1. ${buildingChoices[0].type}       2.${buildingChoices[1].type}`);

        // User decide which building to build
        let userBuildChoice = integerValidator(1,2);
        let buildingToBuild = buildingChoices[userBuildChoice-1];

        // Validates whether coords inputted is available for moves 2 and later
        while (true){
            console.log("\nEnter X Coordinates");
            let coordsX = columnValidator();
            let newCoordsX = coordsX.charCodeAt(0)-65; // Coverts the alphabet to an index

            console.log("\nEnter Y Coordinates");
            let coordsY = integerValidator(0,19);
            // Building is simply built on first turn with 0 validation
            if (moves === 1){
                buildingToBuild.addCoord(newCoordsX, coordsY);
                map[coordsY][newCoordsX] = buildingToBuild;
                break;
            }
            // Moves 1 onwards there is validation 
            else {
                let userInputCoords = [newCoordsX, coordsY];
                if (map[coordsY][newCoordsX] !== undefined){
                    console.log("This square already has a building!");
                }
                else if (!isArrayInArray(userInputCoords, availableCoords)){
                    console.log("This square is not available for building!");
                }
                else {
                    buildingToBuild.addCoord(newCoordsX, coordsY);
                    map[coordsY][newCoordsX] = buildingToBuild;
                    break;
                }
            }
        }
    }
    moves += 1;
}


// When game ends
console.log("================= THE GAME HAS ENDED =================)");
console.log(`Points obtained: ${0}`);

