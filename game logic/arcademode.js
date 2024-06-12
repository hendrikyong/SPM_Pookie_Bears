// ================ INITIATED CLASSES ================

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
        return new Error("Calculation has not been implemented!");
    }

    addCoord(coordX, coordY){
        this.coordX = coordX;
        this.coordY = coordY;
    }
}

class Residential extends Building {
    type = "Residential";
    character = "R";
}
class Commercial extends Building {
    type = "Commercial";
    character = "C";
}
class Park extends Building {
    type = "Park";
    character = "O";
}
class Road extends Building {
    type = "Road";
    character = "*";
}
class Industry extends Building {
    type = "Industry";
    character = "I";
}

// ===================================================

// ================== MAIN PROGRAM ===================

const ps = require("prompt-sync");
const prompt = ps();


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

// Print map function and checks for available spaces
function printMap(map){
    let arrayOfCoords = [];
    let rowNo = 0;
    let rowHeaders = "   A    B    C    D    E    F    G    H    I    J    K    L    M    N    O    P    Q    R    S    T";
    let rowDivider = "======================================================================================================"
    console.log(`${rowHeaders}\n${rowDivider}`);
    for (const row of map){
        let rowStatement = "||";
        for (const element of row){
            if (element === undefined){
                rowStatement += " X ||";
            }
            else{
                rowStatement += ` ${element.character} ||`;
                let tempArray = element.checkSurroundingSpace();
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
    return arrayOfCoords;
}

// Validates user input and returns unique message
function dataValidator(min, max){
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

function isArrayInArray(userInputCoords, availableCoords) {
    // Loop through each inner array in availableCoords
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
// Main Program

while (checkIfMapIsFull(map)){
    console.log("Aracade Mode");
    console.log(`Move: ${moves}`);
    
    let availableCoords = printMap(map);
    let buildingChoices = generateBuildChoices(buildingClasses);
    console.log(`Buidling choices: \n1. ${buildingChoices[0].type}       2.${buildingChoices[1].type}`);
    let userBuildChoice = dataValidator(1,2);



    let buildingToBuild = buildingChoices[userBuildChoice-1];

    // Validates whether coords inputted is available for moves 2 and later
    while (true){

        //Coords X validator
        let coordsX;
        while (true){
            const stringOfLetters = "ABCDEFGHIJKLMNOPQRST";
            coordsX = prompt("Enter column: ");
            if (coordsX.length === 1 && stringOfLetters.includes(coordsX)){
                break;
            }
            else{
                console.log("Input is not valid, ensure that an capitalised letter is inputted!");
            }
        }
        let coordsY = dataValidator(0,19);

        let newCoordsX = coordsX.charCodeAt(0)-65;
        if (moves === 1){
            buildingToBuild.addCoord(newCoordsX, coordsY);
            map[coordsY][newCoordsX] = buildingToBuild;
            break;
        }
        else {
            let userInputCoords = [newCoordsX, coordsY];
            if (map[coordsY][newCoordsX] !== undefined){
                console.log("This square already has a building!");
            }
            else if (!isArrayInArray(userInputCoords, availableCoords)){
                console.log("This square is not available for building!");
            }
            else {
                map[coordsY][newCoordsX] = buildingToBuild;
                break;
            }
        }
    }
    moves += 1;
}

