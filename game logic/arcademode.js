// ================ INITIATED CLASSES ================

class Building {
    coordX;
    coordY;
    constructor(type, character){
        this.type = type;
        this.type = character;
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

// Print map function
function printMap(map){
    let rowNo = 1;
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
            }
        }
        console.log(rowStatement += `   ${rowNo}\n${rowDivider}`)
        rowNo += 1;
    }
}

// Main Program

while (checkIfMapIsFull(map)){
    console.log("Aracade Mode");
    console.log(`Move: ${moves}`);
    
    printMap(map);
    let buildingChoices = generateBuildChoices(buildingClasses);
    if (moves === 1){
        console.log(`Buidling choices: \n1. ${buildingChoices[0].type}       2.${buildingChoices[1].type}`);
        let userBuildChoice = prompt("Enter no. of buiding to build: ")
        let buildingToBuild = buildingChoices[userBuildChoice-1];
        let coordsX = prompt("Enter row: ");
        let coordsY = prompt("Enter column: ");
        coordsX = coordsX.charCodeAt(0)-65;
        console.log(coordsX);
        buildingToBuild.addCoord(coordsX, coordsY-1);
        map[coordsX][coordsY-1] = buildingToBuild;
    }
    else {

    }
    moves += 1;
}
