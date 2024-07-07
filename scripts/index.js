document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");

  var usernameInput = document.getElementById("username");
  var submitButton = document.getElementById("submit");

  submitButton.addEventListener("click", function () {
    // Get the username value
    var username = usernameInput.value;

    // Log the username to the console
    console.log("Username:", username);
  });
});
