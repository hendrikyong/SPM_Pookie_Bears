$(document).ready(function() {
    // Clear local storage for save slots when entering the page
    localStorage.removeItem('saveSlots');
    localStorage.removeItem('currentSaveSlot');

    const apiKey = "66a11886a412941752383803";
    const specificDB = 'ea23';
    const databaseUrl = `https://pookiebears-${specificDB}.restdb.io/rest/beginner-arcademode-saves`;

    // Get the username from local storage
    const username = localStorage.getItem("username");

    if (!username) {
        alert("User not logged in.");
        window.location.href = "./login.html";
        return;
    }

    // Fetch save slots for the current user
    $.ajax({
        async: true,
        crossDomain: true,
        url: `${databaseUrl}?q={"username":"${username}"}`,
        method: "GET",
        headers: {
            "content-type": "application/json",
            "x-apikey": apiKey,
            "cache-control": "no-cache"
        }
    }).done(function(response) {
        const slotsContainer = $("#slots-container");

        // Store save slots in local storage
        localStorage.setItem("saveSlots", JSON.stringify(response));

        // Function to format datetime
        function formatDate(dateString) {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            return date.toLocaleDateString(undefined, options);
        }

        // Display up to 3 save slots
        for (let i = 1; i <= 3; i++) {
            const slot = response.find(slot => slot.saveSlot === i);

            // Create button for save slot
            const button = $(`<button class="save-slot-btn" data-slot="${i}">
                <div class="slot-details"></div>
            </button>`);

            if (slot) {
                // Fill details for existing save slot
                let gamestate;
                try {
                    gamestate = typeof slot.gamestate === 'string' ? JSON.parse(slot.gamestate) : slot.gamestate;
                } catch (error) {
                    console.error("Error parsing gamestate:", error);
                    gamestate = {};
                }
                button.find(".slot-details").html(`
                    <div class='save-slot-number'><strong>Save Slot ${slot.saveSlot}</strong></div>
                    <div>Turn Number: ${gamestate.turnNumber || 'N/A'}</div>
                    <div>Score: ${gamestate.points || 'N/A'}</div>
                    <div>Coins: ${gamestate.coins || '∞'}</div>
                    <div>Date Created: ${formatDate(slot.datetimeCreated) || 'N/A'}</div>
                `);

                // Add delete button if slot is not empty
                const deleteButton = $(`<button class="delete-btn" data-slot="${i}">Delete</button>`);
                button.append(deleteButton);

                // Delete button functionality
                deleteButton.on("click", function(event) {
                    event.stopPropagation(); // Prevent triggering the click event for the button

                    // Delete the save slot from the database
                    $.ajax({
                        async: true,
                        crossDomain: true,
                        url: `${databaseUrl}/${slot._id}`,
                        method: "DELETE",
                        headers: {
                            "x-apikey": apiKey,
                            "cache-control": "no-cache"
                        }
                    }).done(function() {
                        alert(`Save Slot ${i} deleted.`);

                        // Remove the deleted slot from local storage
                        let savedSlots = JSON.parse(localStorage.getItem("saveSlots"));
                        savedSlots = savedSlots.filter(s => s.saveSlot !== i);
                        localStorage.setItem("saveSlots", JSON.stringify(savedSlots));

                        // Clear the deleted slot data from local storage
                        localStorage.removeItem(`currentSaveSlot${i}`);
                        window.location.reload(); // Refresh the page to reflect changes
                    }).fail(function(jqXHR) {
                        alert("An error occurred while deleting the save slot.");
                        console.log(jqXHR);
                    });
                });
            } else {
                // Empty save slot
                button.find(".slot-details").html(`<div><strong>Save Slot ${i}</strong></div>`);
            }

            // Add click event to navigate to arcade-mode and store gamestate
            button.on("click", function() {
                let saveSlotData = slot ? slot : {
                    saveSlot: i,
                };

                // Store the save slot's gamestate in local storage
                localStorage.setItem("currentSaveSlot", JSON.stringify(saveSlotData));
                window.location.href = "./beginner-arcade-mode.html";
            });

            slotsContainer.append(button);
        }
    }).fail(function(jqXHR) {
        alert("An error occurred while fetching save slots.");
        console.log(jqXHR);
    });
});
