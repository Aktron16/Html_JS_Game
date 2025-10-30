const app = document.querySelector(".app")

const overlayBox = document.getElementById("overlayBox");
const user_nickname = document.getElementById("user-nickname");
const menuBtn = document.getElementById('menuBtn');
const avatarBtn = document.getElementById('avatarBtn');
const leaderboardsBtn = document.getElementById('leaderboardsBtn');
const leaderboards_link = document.getElementById('leaderboard_link');
const signoutBt = document.getElementById('signout-bt');

import { user_current as User_Logged_in } from "./module.js";
const logged = checkLoggedin()

function ToggleSideBar(){
    app.classList.toggle("sidebar-open");
};

function ToggleSignOutBox(){
    overlayBox.classList.toggle('active');
};

function LoggedIn() {
    if (logged) {
        avatarBtn.style.display = 'flex';
        user_nickname.textContent = User_Logged_in._nickname;
        leaderboardsBtn.style.display = 'inline-block';
        leaderboards_link.style.display = 'block';
    } else if (!logged) {
        avatarBtn.style.display = 'none';
        leaderboardsBtn.style.display = 'none';
        leaderboards_link.style.display = 'none';
    };
};

function Signout() {
    if (!logged) return;
    if (logged) {
        sessionStorage.removeItem("User_Logged_in");
        location.reload();
    };
};

function checkLoggedin() {
    return User_Logged_in !== null;
};

document.addEventListener('DOMContentLoaded', LoggedIn);

menuBtn.addEventListener('click', ToggleSideBar);
avatarBtn.addEventListener('click', ToggleSignOutBox);
signoutBt.addEventListener('click', Signout);