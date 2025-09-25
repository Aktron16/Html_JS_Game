const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

const avatar = document.getElementById("avatarBtn");
const overlayBox = document.getElementById("overlayBox");

function ToggleSideBar(){
    if (sidebar.style.display === "none"){
        sidebar.style.display = "block";
    } else {
        sidebar.style.display = "none";
    }
};

function ToggleSignOutBox(){
    if (overlayBox.style.display === "none"){
        overlayBox.style.display = "block";
    } else {
        overlayBox.style.display = "none";
    }
};