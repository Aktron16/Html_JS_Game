const app = document.querySelector(".app")

const avatar = document.getElementById("avatarBtn");
const overlayBox = document.getElementById("overlayBox");

function ToggleSideBar(){
    app.classList.toggle("sidebar-open");
};

function ToggleSignOutBox(){
    overlayBox.classList.toggle('active');
};