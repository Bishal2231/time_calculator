const signinForm = document.querySelector("form");
const loadingScreen = document.getElementById("loadingScreen");

signinForm.addEventListener("submit", function(event) {
    // Check if form is valid before showing loading screen
    if (signinForm.reportValidity()) {
        loadingScreen.style.display = "flex"; // Show loading screen only if form is valid
    } else {
        event.preventDefault(); // Prevent form submission if it's invalid
    }
});
