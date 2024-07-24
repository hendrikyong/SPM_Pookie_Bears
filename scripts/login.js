$(document).ready(function() {

    const apiKey = "66a11886a412941752383803";
    const specificDB= 'ea23'
    const databaseUrl = "https://pookiebears-" + specificDB + ".restdb.io/rest/accounts";

    $("#login-form").submit(function(event) {
        event.preventDefault();
        
        const username = $("#username").val();
        const password = $("#password").val();

        // Fetch user data based on the entered username
        $.ajax({
            async: true,
            crossDomain: true,
            url: `${databaseUrl}?q={"username":"${username}"}`,
            method: "GET",
            headers: {
                "content-type": "application/json",
                "x-apikey": apiKey,
                "cache-control": "no-cache"
            },
        }).done(function(response) {
            if (response.length === 0) {
                // Username not found
                alert("Username not found. Please register.");
            } else {
                // Check if the password matches
                const user = response[0];
                if (user.password === password) {
                    // Store the username in local storage
                    localStorage.setItem("username", username);

                    alert("Login successful!");
                    console.log("User logged in:", user);

                    window.location.href = "./menu.html";
                } else {
                    alert("Incorrect password. Please try again.");
                }
            }
        }).fail(function(jqXHR) {
            alert("An error occurred. Please try again.");
            console.log(jqXHR);
        });
    });
});
