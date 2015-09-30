var canvas = document.querySelector(".projector-light");
var canvasCtx = canvas.getContext("2d");
var screen = document.querySelector(".main-content");

function findMenuItemByURLHash(hash) {
	return document.querySelector(".nav-link[href=\"" + hash + "\"]");
}

function drawLightFromMenuItem(menuItem) {
	if (menuItem) {
		var screenBB = screen.getBoundingClientRect();
		var menuItemBB = menuItem.getBoundingClientRect();
		canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
		canvasCtx.beginPath();
		canvasCtx.moveTo(menuItemBB.right - 10, menuItemBB.top - 20 + menuItemBB.height/2 );
		canvasCtx.lineTo(screenBB.left - 20, screenBB.top - 20);
		canvasCtx.lineTo(screenBB.left - 20, screenBB.bottom - 20);
		canvasCtx.closePath();
		canvasCtx.fillStyle = "rgba(200, 200, 255, .1)";
		canvasCtx.fill();
	}
}

drawLightFromMenuItem(findMenuItemByURLHash("#mymotherlovesme"));

window.addEventListener("hashchange", function(event) {
	var menuItem = findMenuItemByURLHash(window.location.hash);

	var oldSelectedItem = document.querySelector(".nav-selected");
	oldSelectedItem.classList.remove("nav-selected");
	menuItem.classList.add("nav-selected");
	drawLightFromMenuItem(menuItem);
});