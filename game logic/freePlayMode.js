// ================ INITIATED CLASSES ================
// These to be placed in a js file that can be accessed by other js files

class Building {
    id;
    coordX;
    coordY;
    surroundingBuildings = [undefined, undefined, undefined, undefined];
    constructor(id){
        this.id = id;
    }
    // Returns an array of coords to check
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

    // Returns 0 if calculatePointsAndProfit is not implemented in respective classes
    // Else return dict with keys : score, coins (optional)
    calculatePointsAndProfit() {
        return 0;
    }

    // Adds coords of building to each object for checkSuroundingSpace()
    addCoord(coordX, coordY){
        this.coordX = coordX;
        this.coordY = coordY;
    }

    // Adjusts coordinates according to increase of map
    adjustCoord(){
        this.coordX += 5;
        this.coordY += 5;
    }

    // Return position index.
    // 0 = North; 1 = South; 2 = East; 3 = West (N, S, E, W)
    checkPosition(space){
        // Position: S
        let position;
        if (space[1] > this.coordY && space[0] === this.coordX){
            position = 1;
        }
        // Position: N
        else if (space[1] < this.coordY && space[0] === this.coordX){
            position = 0;
        }
        // Position: W
        else if (space[1] === this.coordY && space[0] > this.coordX){
            position = 2;
        }
        //Position: E
        else if (space[1] === this.coordY && space[0] < this.coordX){
            position = 3;
        }
        return position;
    }
}

class Residential extends Building {
    type = "Residential";
    character = "R";

    // Return dict with key: "score" and "coins"
    calculatePointsAndProfit(map, spacesToCheck){
        let coinsEarned = 1;
        let scoreEarned = 0;
        for (const space of spacesToCheck){
            let position = this.checkPosition(space);
            // If space is a building
            if (map[space[1]][space[0]] !== undefined){
                let adjBuilding = map[space[1]][space[0]];
                // Checks if buildings next to it (East & West) is Industry
                if (adjBuilding.type === "Industry" && (position === 3 || position === 4) && this.surroundingBuildings[position] === undefined){
                    scoreEarned += 1;
                }
                // Checks if adjacent building is Residential or Commercial
                else if ((adjBuilding.type === "Residential" || adjBuilding.type === "Commercial") && this.surroundingBuildings[position] === undefined){
                    scoreEarned += 1;
                }
                // Checks if adjacent building is Park
                else if (adjBuilding.type === "Park" && this.surroundingBuildings[position] === undefined){
                    scoreEarned += 2;
                }
                this.surroundingBuildings[position] = adjBuilding;
            }
            // If space is empty
            else {
                // Checks if its undefined space remains undefined under surroundingBuildings.
                // Used when one of the surrounding building is demolised the previous turn  
                if (this.surroundingBuildings[position] !== undefined){
                    this.surroundingBuildings[position] = undefined;
                }
            }
        }
        coinsEarned -= this.surroundingBuildings.filter(building => building?.type === "Residential").length;
        return {"coins" : coinsEarned, "score" : scoreEarned};
    }
}
class Industry extends Building {
    type = "Industry";
    character = "I";

    // Returns dict with key: "coins"
    calculatePointsAndProfit(map, spacesToCheck){
        let coinsEarned = 1;
        let scoreEarned = 0;
        for (const space of spacesToCheck){
            let position = this.checkPosition(space);
            // If space is a building
            if (map[space[1]][space[0]] !== undefined){
                let adjBuilding = map[space[1]][space[0]];
                this.surroundingBuildings[position] = adjBuilding;
            }
            // If space is empty
            else { 
                if (this.surroundingBuildings[position] !== undefined){
                    this.surroundingBuildings[position] = undefined;
                }
            }
        }
        // Point is added for existing
        if (this.defaultScore === 1){
            scoreEarned += this.defaultScore;
            this.defaultScore = 0;
        }
        
        // Unsure if industry still generate coins
        // coinsEarned += this.surroundingBuildings.filter(building => building?.type === "Residential").length;
        return {"score" : scoreEarned, "coins" : coinsEarned};
    }
}
class Commercial extends Building {
    type = "Commercial";
    character = "C";

    //Returns objects with key: "coins"
    calculatePointsAndProfit(map, spacesToCheck){
        let coinsEarned = 1;
        let scoreEarned = 0;
        for (const space of spacesToCheck){
            let position = this.checkPosition(space);
            // If space is a building
            if (map[space[1]][space[0]] !== undefined){
                let adjBuilding = map[space[1]][space[0]];
                // Checks if adjacent buildings are Residential
                if (adjBuilding.type === "Commercial" && this.surroundingBuildings[position] === undefined){
                    scoreEarned += 1;
                }
                this.surroundingBuildings[position] = adjBuilding;
            }
            // If space is empty
            else { 
                if (this.surroundingBuildings[position] !== undefined){
                    this.surroundingBuildings[position] = undefined;
                }
            }
        }

        // Unsure if Commercial generates coins
        // coinsEarned += this.surroundingBuildings.filter(building => building?.type === "Residential").length;
        return {"score" : scoreEarned, "coins" : coinsEarned};
    }

}
class Park extends Building {
    type = "Park";
    character = "O";

    calculatePointsAndProfit(map, spacesToCheck){
        let coinsEarned = -1;
        let scoreEarned = 0;
        for (const space of spacesToCheck){
            let position = this.checkPosition(space);
            // If space is a building
            if (map[space[1]][space[0]] !== undefined){
                let adjBuilding = map[space[1]][space[0]];
                // Checks if adjacent buildings are Residential
                if (adjBuilding.type === "Park" && this.surroundingBuildings[position] === undefined){
                    scoreEarned += 1;
                }
                this.surroundingBuildings[position] = adjBuilding;
            }
            // If space is empty
            else { 
                if (this.surroundingBuildings[position] !== undefined){
                    this.surroundingBuildings[position] = undefined;
                }
            }
        }
        return {"score" : scoreEarned, "coins" : coinsEarned};
    }
}
class Road extends Building {
    type = "Road";
    character = "*";

    calculatePointsAndProfit(map, spacesToCheck){
        let coinsEarned = 0;
        let scoreEarned = 0;
        for (const space of spacesToCheck){
            let position = this.checkPosition(space);
            // If space is a building
            if (map[space[1]][space[0]] !== undefined){
                let adjBuilding = map[space[1]][space[0]];
                // Checks if adjacent buildings are Residential
                if (adjBuilding.type === "Road" && this.surroundingBuildings[position] === undefined){
                    scoreEarned += 1;
                }
                this.surroundingBuildings[position] = adjBuilding;
            }
            // If space is empty
            else { 
                if (this.surroundingBuildings[position] !== undefined){
                    this.surroundingBuildings[position] = undefined;
                }
            }
        }
        // Profit becomes negative when there is no connecting road
        if (this.surroundingBuildings.filter(building => building?.type === "Road").length === 0){
            coinsEarned -= 1;
        }
        return {"coins" : coinsEarned, "score" : scoreEarned};
    }
}

// ===================================================

// ==================== FUNCTIONS ====================
// These to be placed in a js file that can be accessed by other js files

const ps = require("prompt-sync");
const prompt = ps();

function generateBuildChoices(buildingClasses, moves){
    let buildingChoices = [];
    for (const buildingClass of buildingClasses){
        buildingClass.push(new buildingChoices(moves));
    }
    return buildingChoices;
}

// Check whether there is a building built on border
function hasBuildingOnBorder(map) {
    // Check top and bottom borders (including corners)
    for (let col = 0; col < map[0].length; col++) {
        if (map[0][col] !== undefined || map[map.length - 1][col] !== undefined) {
            return true;
        }
    }
  
    // Check left and right borders (including corners)
    for (let row = 0; row < map.length; row++) {
        if (map[row][0] !== undefined || map[row][map[row].length - 1] !== undefined) {
            return true;
        }
    }
  
    // No value found on borders yet
    return false;
}

// Expand map
function expandMapAndAdjust(map) {
    for (const row of map){
        for (const space of row){
            if (space !== undefined){
                space.adjustCoord();
            }
        }
    }

    let lengthOfRow = map[0].length;
    console.log(lengthOfRow);
    let tempRow = [];
    // Prepare empty rows
    for (let i = 0; i < lengthOfRow + 10; i++){
        tempRow.push(undefined);
    }

    for (let i = 0; i < 5; i++){
        map.splice( 0, 0, tempRow);
        map.push(tempRow);
    }

    for (let i = 5; i < 10; i++){
        let selectedRow = map[i];
        for (let i = 0; i < 5; i++){
            selectedRow = [undefined, ...selectedRow];
            selectedRow.push(undefined);
        }
        map[i] = selectedRow;
    }

    return map;
}
  

// Print map function and perform operations for the following: 
// 1. Check for available spaces 
// 2. Score calculation 
// Return a dictionary 
function printMap(map){
    let coins = 0;
    let score = 0;
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
                // Add score awarded to total score
                let tempDict = element.calculatePointsAndProfit(map, tempArray);
                score += tempDict["score"];
                
                // Add coins awarded to total coins
                if (element.type === "Commercial" || element.type === "Industry"){
                    coins += tempDict["coins"];
                }
                for (let coord of tempArray){
                    if (arrayOfCoords.includes(coord) === false){
                        arrayOfCoords.push(coord);
                    }
                }
            }
        }
        console.log(rowStatement += `   ${rowNo}\n${rowDivider}`)
        rowNo += 1;
    }
    return {
        "score" : score,
        "coins" : coins,
        "availableCoords" : arrayOfCoords
    };
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

// ===============================================` ====

const buildingClasses = [ Residential, Industry, Commercial, Park, Road];
let coins = 0;
let score = 0;
let consecNegProfit = 0;
let map =  [[,,,,,],
            [,,,,,],
            [,,,,,],
            [,,,,,],
            [,,,,,]];

while (consecNegProfit < 20){
    // Display map and moves
    if (hasBuildingOnBorder(map)){
        expandMapAndAdjust(map);
    }
    let dict = printMap(map);

    score += dict["score"];
    coins += dict["coins"];

    if (coins < 0){
        consecNegProfit += 1;
    }
    else {
        consecNegProfit = 0;
    }

    console.log("\n//======= Aracade Mode =======//");
    console.log(`           Move: ${moves}`);
    console.log(`           Profit: ${coins}`);
    console.log(`           Score: ${score}`);
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
                let buildingToDemolish = map[coordsY][newCoordsX];
                console.log("\nAre you sure? 0 to confirm demolish and 1 to cancel.")
                let userInput = integerValidator(0,1);
                if (userInput === 0){
                    map[coordsY][newCoordsX] = undefined;
                    coins -= 1;
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
        let buildingChoices = generateBuildChoices(buildingClasses, moves);
        console.log(`\nBuidling choices: \n1. ${buildingChoices[0].type}       
                        2.${buildingChoices[1].type}       
                        3.${buildingChoices[2].type}       
                        4.${buildingChoices[3].type}       
                        5.${buildingChoices[4].type}`);
        
        // User decide which building to build
        let userBuildChoice = integerValidator(1,5);
        let buildingToBuild = buildingChoices[userBuildChoice-1];
        coins -= 1;

        while (true){
            console.log("\nEnter X Coordinates");
            let coordsX = columnValidator();
            let newCoordsX = coordsX.charCodeAt(0)-65; // Coverts the alphabet to an index

            console.log("\nEnter Y Coordinates");
            let coordsY = integerValidator(0,19);
            // Building is simply built on first turn with 0 validation

            // Moves 1 onwards there is validation 
            if (map[coordsY][newCoordsX] !== undefined){
                console.log("This square already has a building!");
            }
            else {
                buildingToBuild.addCoord(newCoordsX, coordsY);
                map[coordsY][newCoordsX] = buildingToBuild;
                break;
            }
        }
    }
    moves += 1;
}




