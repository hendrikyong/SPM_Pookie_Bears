document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");

  
  const apiKey = "66a11886a412941752383803";
  const specificDB= 'ea23'
  const databaseUrl = "https://pookiebears-" + specificDB + ".restdb.io/rest/";

  // const url = "https://pookiebears-04f9.restdb.io/rest/arcadeleaderboard";
  // const apikey = "6686c097e0ddd887ed0940e1";
  // const url = "https://feddddd-6882.restdb.io/rest/assignment2leaderboard";
  // const apikey = "65c4358c86354f3586464a0d";
  const url = databaseUrl + "arcadeleaderboard";
  const apikey = apiKey;
  const currentPage = window.location.pathname; // Get current page path
  const arcadeButton = document.getElementById("arcade-button");
  const beginnerArcadeButton = document.getElementById("beginner-arcade-button");

  if (currentPage.includes("arcade-leaderboard.html")) {
    arcadeButton.classList.add("active");
  } else if (currentPage.includes("beginner-arcade-leaderboard.html")) {
    beginnerArcadeButton.classList.add("active");
  }

  getData();

  //retrieve high score from
  function getHighScore(name, highScore) {
    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": apikey,
        "cache-control": "no-cache",
      },
    };

    fetch(url, settings)
      .then((response) => response.json())
      .then((data) => {
        const existingUser = data.find((user) => user.name === name);

        if (existingUser && highScore > existingUser.score) {
          let updateSetting = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-apikey": apikey,
              "cache-control": "no-cache",
            },
            body: JSON.stringify({ score: highScore }),
          };

          fetch(`${url}/${existingUser._id}`, updateSetting)
            .then((response) => response.json())
            .then((updatedData) => {
              console.log("Score updated in database: ", updatedData);
              getData();
            })
            .catch((error) => console.error("Error updating score: ", error))
            .then(() => {
              // Update leaderboard after score update
              getData();
            });
        }
      });
  }

  //get data from db
  function getData(limit = 10) {
    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": apikey,
        "cache-control": "no-cache",
      },
    };

    fetch(url, settings)
      .then((response) => response.json())
      .then((response) => {
        // Create a map to store unique users and their highest scores
        let userScoresMap = new Map();

        // Iterate through the response data to update the userScoresMap
        response.forEach((user) => {
          if (
            !userScoresMap.has(user.name) ||
            userScoresMap.get(user.name) < user.score
          ) {
            userScoresMap.set(user.name, user.score);
          }
        });

        // Convert the map back to an array of objects
        let uniqueUserScores = Array.from(userScoresMap, ([name, score]) => ({
          name,
          score,
        }));

        // Sort the uniqueUserScores array by score in descending order
        uniqueUserScores.sort((a, b) => b.score - a.score);

        // Create HTML content for leaderboard
        let content = "";
        let count = 1;
        for (let i = 0; i < uniqueUserScores.length && i < limit; i++) {
          content += `<tr class="leaderboard-row" style="color: black; background-color:white;"> 
              <td class="rank">${count++}.</td> 
              <td class="name">${uniqueUserScores[i].name}</td> 
              <td class="score">${uniqueUserScores[i].score}</td> 
              </tr>`;
        }
        document.getElementById("leaderboard").innerHTML = content;
      });
  }
});
