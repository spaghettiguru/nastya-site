"use strict";

(function() {
var canvas = document.getElementById("projector-light");
var sidebar = document.getElementById("sidebar");
canvas.width = sidebar.getBoundingClientRect().width;
canvas.height = document.body.clientHeight;
var canvasCtx = canvas.getContext("2d");
var screen = document.getElementById("main-content");
var lastPoint = {x: 0, y: 0};

var FILL_STYLE = "rgba(200, 200, 255, .15)";

canvasCtx.fillStyle = FILL_STYLE;

function drawLightFromMenuItem(menuItem, animationEndCallback) {
		var screenBB = screen.getBoundingClientRect();
		var menuItemBB = menuItem.getBoundingClientRect();
		var x1 = menuItemBB.right + 10,
		y1 = menuItemBB.top + menuItemBB.height/2,
		x2 = screenBB.left,
		y2 = screenBB.top,
		x3 = x2,
		y3 = screenBB.bottom;

		if (typeof animationEndCallback == "function") {
			var xDistance = Math.abs(lastPoint.x - x1);
			var yDistance = Math.abs(lastPoint.y - y1);
			var XToYdistanceRatio = xDistance / yDistance;
			var multiplier = 5;
			var xStep = (lastPoint.x < x1 ? 1 : -1) * multiplier * XToYdistanceRatio;
			var yStep = (lastPoint.y < y1 ? 1 : -1) * multiplier;

			window.requestAnimationFrame(function paintFrame() {
				canvasCtx.clearRect(lastPoint.x, 0, canvas.width - lastPoint.x, canvas.height);

				if (lastPoint.x !== x1) {
					lastPoint.x += Math.abs(xStep) <= Math.abs(x1 - lastPoint.x) ? xStep : (x1 - lastPoint.x);
				}

				if (lastPoint.y !== y1) {
					lastPoint.y += Math.abs(yStep) <= Math.abs(y1 - lastPoint.y) ? yStep : (y1 - lastPoint.y);
				}

				drawTriangle(lastPoint.x, lastPoint.y, x2, y2, x3, y3);
				
				if (lastPoint.x !== x1 && lastPoint.y !== y1) {
					window.requestAnimationFrame(paintFrame);
				} else {
					animationEndCallback();
				}
			});
		} else {
			canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
			drawTriangle(x1, y1, x2, y2, x3, y3);
			lastPoint = {x: x1, y: y1};
		}
}

function drawTriangle(x1, y1, x2, y2, x3, y3) {
	canvasCtx.beginPath();
	canvasCtx.moveTo(x1, y1);
	canvasCtx.lineTo(x2, y2);
	canvasCtx.lineTo(x3, y3);
	canvasCtx.closePath();
	canvasCtx.fill();
}

window.addEventListener("load", function(e) {
	// draw initial triangle
	drawLightFromMenuItem(document.querySelector(".nav-selected"));
});

window.addEventListener("resize", function(e) {
	canvas.height = document.body.clientHeight;
	canvas.width = sidebar.getBoundingClientRect().width;
	canvasCtx.fillStyle = FILL_STYLE;
	drawLightFromMenuItem(document.querySelector(".nav-selected"));
});

var navigationLinks = document.querySelectorAll(".nav-link");
Array.prototype.slice.call(navigationLinks).forEach(function(navLink, index) {
	navLink.addEventListener("click", function(event) {
		var oldSelectedItem = document.querySelector(".nav-selected");
		oldSelectedItem.classList.remove("nav-selected");
		var clickedItem = this;
		clickedItem.classList.add("nav-selected");
		drawLightFromMenuItem(clickedItem, function(e) {
			document.getElementById("contentFrame").setAttribute("src", clickedItem.getAttribute("href"));
		});
		event.preventDefault();
	});
});
})();