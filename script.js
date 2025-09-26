const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const app = document.querySelector(".app")

const avatar = document.getElementById("avatarBtn");
const overlayBox = document.getElementById("overlayBox");

function ToggleSideBar(){
    app.classList.toggle("sidebar-open");
};

function ToggleSignOutBox(){
    if (overlayBox.style.display === "none"){
        overlayBox.style.display = "block";
    } else {
        overlayBox.style.display = "none";
    }
};