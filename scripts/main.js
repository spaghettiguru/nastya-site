"use strict";

(function() {
var canvas = document.getElementById("projector-light");
var sidebar = document.getElementById("sidebar");
canvas.width = sidebar.getBoundingClientRect().width;
canvas.height = document.body.clientHeight;
var canvasCtx = canvas.getContext("2d");
var screen = document.getElementById("main-content");
var lastPoint = {x: 0, y: 0};

var FILL_STYLE = "rgba(200, 200, 255, .1)";

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
	if (window.innerWidth > 1000) {
		canvas.height = document.body.clientHeight;
		canvas.width = sidebar.getBoundingClientRect().width;
		canvasCtx.fillStyle = FILL_STYLE;
		drawLightFromMenuItem(document.querySelector(".nav-selected"));
	}
});

function navigateToSection(event) {
	event.preventDefault();
	var oldSelectedItem = document.querySelector(".nav-selected");
	oldSelectedItem.classList.remove("nav-selected");
	var clickedItem = this;
	clickedItem.classList.add("nav-selected");
	drawLightFromMenuItem(clickedItem, function(e) {
		document.getElementById("contentFrame").setAttribute("src", clickedItem.getAttribute("href"));
	});
}

function showNavigation() {
	sidebar.style.transition = "height .3s ease-out";
	sidebar.style.height = "380px";
}

function hideNavigation() {
	sidebar.style.transition = "height .3s ease-out";
	sidebar.style.height = "40px";
}

var navigationLinks = document.querySelectorAll(".nav-link");
Array.prototype.slice.call(navigationLinks).forEach(function(navLink, index) {
	navLink.addEventListener("click", navigateToSection);
	navLink.addEventListener("touchstart", function(event) {
		navigateToSection.call(this, event);
		hideNavigation();
		event.stopImmediatePropagation();
	});
});

var mediaQueryList = window.matchMedia("(max-width: 960px)");
mediaQueryList.addListener(function handleResolutionChange() {
	if (mediaQueryList.matches) {
		setupTouchSupport();
	} else {
		removeTouchSupport();
	}
});

if (mediaQueryList.matches) {
	setupTouchSupport();
}

/* Touch events */

window.PointerEventsSupport = false;

var pointerDownName = 'MSPointerDown';
var pointerUpName = 'MSPointerUp';
var pointerMoveName = 'MSPointerMove';

if(window.PointerEvent) {
	pointerDownName = 'pointerdown';
	pointerUpName = 'pointerup';
	pointerMoveName = 'pointermove';
}

// Simple way to check if some form of pointerevents is enabled or not
if(window.PointerEvent || window.navigator.msPointerEnabled) {
  window.PointerEventsSupport = true;
}

function setupTouchSupport() {

	if (window.PointerEventsSupport) {
	  // Add Pointer Event Listener
	  sidebar.addEventListener(pointerDownName, slideDownNavStart, false);
	} else {
	  // Add Touch Listener
	  sidebar.addEventListener('touchstart', slideDownNavStart, false);

	  // Add Mouse Listener
	  sidebar.addEventListener('mousedown', slideDownNavStart, false);
	}
}

function removeTouchSupport() {
	if (window.PointerEventsSupport) {
	  // Remove Pointer Event Listener
	  sidebar.removeEventListener(pointerDownName, slideDownNavStart, false);
	} else {
	  // Remove Touch Listener
	  sidebar.removeEventListener('touchstart', slideDownNavStart, false);

	  // Remove Mouse Listener
	  sidebar.removeEventListener('mousedown', slideDownNavStart, false);
	}
}

var initialTouchPos;

function getGesturePointFromEvent(event) {
    var point = {};

    if(event.targetTouches) {
      // Prefer Touch Events
      point.x = event.targetTouches[0].clientX;
      point.y = event.targetTouches[0].clientY;
    } else {
      // Either Mouse event or Pointer Event
      point.x = event.clientX;
      point.y = event.clientY;
    }

    return point;
  }

function slideDownNavStart(event) {

  if(event.touches && event.touches.length > 1) {
    return;
  }

  // Add the move and end listeners
  if (window.PointerEventsSupport) {
    document.addEventListener(pointerMoveName, handleGestureMove, true);
    document.addEventListener(pointerUpName, handleGestureEnd, false);
  } else {
    document.addEventListener('touchmove', handleGestureMove, true);
    document.addEventListener('touchend', handleGestureEnd, false);
    document.addEventListener('touchcancel', handleGestureEnd, true);

    document.addEventListener('mousemove', handleGestureMove, true);
    document.addEventListener('mouseup', handleGestureEnd, false);
  }

  initialTouchPos = getGesturePointFromEvent(event);

  sidebar.style.transition = 'initial';
}

function handleGestureMove(event) {
	event.preventDefault();
	var point = getGesturePointFromEvent(event);
	sidebar.style.height = point.y + "px";
}

function handleGestureEnd(event) {
  event.preventDefault();

  if(event.touches && event.touches.length > 0) {
    return;
  }

  // Remove Event Listeners
  if (window.PointerEventsSupport) {
    // Remove Pointer Event Listeners
    document.removeEventListener(pointerMoveName, handleGestureMove, true);
    document.removeEventListener(pointerUpName, handleGestureEnd, false);
  } else {
    // Remove Touch Listeners
    document.removeEventListener('touchmove', handleGestureMove, true);
    document.removeEventListener('touchend', handleGestureEnd, false);
    document.removeEventListener('touchcancel', handleGestureEnd, true);

    // Remove Mouse Listeners
    document.removeEventListener('mousemove', handleGestureMove, true);
    document.removeEventListener('mouseup', handleGestureEnd, false);
  }

  sidebar.style.transition = "height .3s ease-out";

  if (sidebar.offsetHeight > 190) {
  	sidebar.style.height = "380px";
  } else {
  	sidebar.style.height = "40px";
  }
}

})();