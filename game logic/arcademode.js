// ================ INITIATED CLASSES ================

class Building {
    constructor(type, character){
        this.type = type;
        this.type = character;
    }
    pointCalculation() {
        return new Error("Calculation has not been implemented!");
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
        randomIndex = Math.floor(Math.random() * (5)) + 1
        if (randomIndexes.includes(randomIndex) === false){
            randomIndexes.push(randomIndex);
        }
    }

    for (const randomIndex of randomIndexes) {
        const randomBuildingClass = buildingClasses[randomIndex];
        randomBuildings.push(new randomBuildingClass()); // Create new instance
    }
    return randomBuildings;
}

// Check whether the map is completely filled
function checkIfMapIsFull(){
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

while (checkIfMapIsFull()){
    console.log("Aracade Mode");
    console.log(`Move: ${moves}`);
    console.log(map);


    moves += 1;
}
