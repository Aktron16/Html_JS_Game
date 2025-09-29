const app = document.querySelector(".app")

const avatar = document.getElementById("avatarBtn");
const overlayBox = document.getElementById("overlayBox");

let User_Logged_in = JSON.parse(localStorage.getItem('User_Logged_in')) || [];
const logged = checkLoggedin()

function ToggleSideBar(){
    app.classList.toggle("sidebar-open");
};

function ToggleSignOutBox(){
    overlayBox.classList.toggle('active');
};

function LoggedIn() {
    if (logged) {
        avatar.style.display = 'flex';
    } else if (!logged) {
        avatar.style.display = 'none';
    };
}

function Signout() {
    if (!logged) {
        alert("You aren't logged in...");
        return;
    } else if (logged) {
        localStorage.removeItem("User_Logged_in");
        location.reload();
        LoggedIn();
    }
}

function checkLoggedin() {
    return User_Logged_in.length > 0;
}

document.addEventListener('DOMContentLoaded', LoggedIn);