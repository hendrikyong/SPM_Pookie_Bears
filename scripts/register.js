$(document).ready(function() {

    const apiKey = "669d4e46dd601fb66cc41805";
    const specificDB= '2784'
    const databaseUrl = "https://pookiebears-" + specificDB + ".restdb.io/rest/accounts";

    $("#register-form").submit(function(event) {
        event.preventDefault();
        
        const username = $("#username").val();
        const password = $("#password").val();
        const created = new Date().toISOString(); // Get current date and time in ISO format

        const jsondata = {
            "username": username,
            "password": password,
            "dateTimeCreated": created
        };

        const settings = {
            async: true,
            crossDomain: true,
            url: databaseUrl,
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-apikey": apiKey,
                "cache-control": "no-cache"
            },
            processData: false,
            data: JSON.stringify(jsondata)
        };

        $.ajax(settings).done(function(response) {
            alert("Registration successful!");
            console.log(response);
            window.location.href = "./login.html";
        }).fail(function(jqXHR) {
            const response = jqXHR.responseJSON;
            if (response && response.name === "ValidationError" && response.list) {
                const usernameError = response.list.find(error => error.field === "username");
                if (usernameError && usernameError.message.includes("Already exists")) {
                    alert("Username already exists. Please choose another one.");
                } else {
                    alert("An error occurred during registration. Please try again.");
                }
            } else {
                alert("An error occurred. Please try again.");
            }
            console.log(jqXHR);
        });
    });
});
