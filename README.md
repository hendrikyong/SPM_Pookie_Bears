# SPM Pookie Bears: Arcade City-Building Game

## Overview

**SPM Pookie Bears** is an exciting arcade-based city-building game with three game modes:
1. **Arcade Beginner Mode**
2. **Normal Arcade Mode**
3. **Free Play Mode**

The game challenges players to build and manage a city strategically to maximize happiness and prosperity. Developed as part of the Software Project Management (SPM) module, the project applies Scrum methodologies for planning and execution.

## Game Modes and Features

### Game Modes
1. **Arcade Beginner Mode**:
   - Start with limited coins and grid size.
   - Randomly selected buildings each turn.
   - Score as many points as possible through strategic building placement.

2. **Normal Arcade Mode**:
   - A more challenging version of the Beginner mode with added complexities.

3. **Free Play Mode**:
   - Unlimited coins and a grid that expands dynamically.
   - Freedom to construct any building without restrictions.

### Key Features
- **City-Building Gameplay**:
  - Construct and demolish buildings.
  - Earn points based on adjacency and placement of buildings.
  - Expand your city dynamically in Free Play mode.
  
- **Resource Management**:
  - Coins are earned and spent based on building upkeep and generation.

- **Save and Load Games**:
  - Save the current game state to resume later.

- **High Score System**:
  - Records the top 10 scores for both Arcade and Free Play modes.

- **End Conditions**:
  - **Arcade Mode**: Ends when coins run out or the grid is full.
  - **Free Play Mode**: Ends if the city incurs losses for 20 consecutive turns.

## How to Run the Game

1. **Open the Project in VS Code**:
   - Clone the repository:
     ```bash
     git clone https://github.com/hendrikyong/SPM_Pookie_Bears.git
     cd SPM_Pookie_Bears
     ```
   - Open the project folder in [Visual Studio Code](https://code.visualstudio.com/).

2. **Start a Local Server**:
   - Install the "Live Server" extension in VS Code.
   - Right-click on the `menu.html` file and select **"Open with Live Server"**.
   - The game will run at `http://localhost:3000`.

3. **Play the Game**:
   - Use the main menu to select a game mode:
     - **Start New Arcade Game**
     - **Start New Free Play Game**
     - **Load Saved Game**
     - **Display High Scores**

## Scoring and Rules

### Buildings and Scoring
- **Residential (R)**:
  - +1 point per adjacent Residential or Commercial.
  - +2 points per adjacent Park.
  - -1 point if adjacent to an Industry.

- **Industry (I)**:
  - +1 point per Industry in the city.
  - Generates +1 coin per adjacent Residential.

- **Commercial (C)**:
  - +1 point per adjacent Commercial.
  - Generates +1 coin per adjacent Residential.

- **Park (O)**:
  - +1 point per adjacent Park.

- **Road (*)**:
  - +1 point per connected Road in the same row.

### Resource Management
- Residential, Industry, Commercial, Parks, and Roads have unique upkeep and profit mechanics. Proper planning is essential to avoid deficits.

## Development Methodology

This project was developed using the Scrum Framework:
- **Sprints**:
  - 2-week iterations to ensure consistent progress.
- **User Stories**:
  - Captured and tracked in Jira using the provided templates.
- **Team Collaboration**:
  - Peer evaluations, retrospectives, and sprint reviews to enhance team effectiveness.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: None (runs on the browser with local hosting)
- **Version Control**: Git
- **Project Management**: Jira

## Acknowledgements

Special thanks to:
- Mr Terence for his guidance as a stakeholder/teacher.
- Fellow teammates for their collaboration on this exciting project.
