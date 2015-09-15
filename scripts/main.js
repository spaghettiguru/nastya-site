var canvasCtx = document.querySelector(".projector-light").getContext("2d");
var screen = document.querySelector(".main-content");
var screenBB = screen.getBoundingClientRect();
var menuItems = document.querySelectorAll(".nav-link");

var firstItemBB = menuItems[1].getBoundingClientRect();
canvasCtx.beginPath();
canvasCtx.moveTo(firstItemBB.right - 20, firstItemBB.top - 20 + firstItemBB.height/2 );
canvasCtx.lineTo(screenBB.left - 20, screenBB.top - 20);
canvasCtx.lineTo(screenBB.left - 20, screenBB.bottom - 20);
canvasCtx.closePath();
canvasCtx.fillStyle = "rgba(255, 255, 255, .12)";
canvasCtx.fill();