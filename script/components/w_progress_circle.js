createProgressCircle();
function createProgressCircle(item) {
  // item.value = document.createElement("div");

  var _svg = document.createElement("svg");
  // _svg.style.width = item.value.style.width;
  // _svg.style.height = item.value.style.width;
  _svg.style.width = "170px";
  _svg.style.height = "170px";
  // _svg.style.height = item.value.style.width;
  var _background = document.createElement("circle");
  _background.style.cx = "85";
  _background.style.cy = "85";
  _background.style.r = "83";
  _background.style.fill = "none";
  _background.style.strokeWidth = "3px";
  _background.style.stroke = "#1A2C34";
  // var calStrokeDash = (item.value.clientWidth - 4) * Math.PI;
  var calStrokeDash = (170 - 4) * Math.PI;
  var calStrokeOffset = (calStrokeDash * (100 - 30)) / 100;
  var _mainProgress = document.createElement("circle");
  _mainProgress.style.cx = "85";
  _mainProgress.style.cy = "85";
  _mainProgress.style.r = "83";
  _mainProgress.style.fill = "none";
  _mainProgress.style.strokeWidth = "3px";
  _mainProgress.style.strokeLinecap = "round";
  _mainProgress.style.transform = "rotate(-90deg)";
  _mainProgress.style.transformOrigin = "50% 50%";
  _mainProgress.style.stroke = "lime";
  _mainProgress.style.strokeDasharray = `${calStrokeDash}`;
  _mainProgress.style.strokeDashoffset = `${calStrokeOffset}`;
  _mainProgress.animate(
    [
      {
        strokeDashoffset: 521,
      },
      {
        strokeDashoffset: 178,
      },
    ],
    2000
  );
  _svg.appendChild(_background);
  _svg.appendChild(_mainProgress);
  document.body.appendChild(_svg);

  // var _progressCircle = document.createElement("div");
  // _progressCircle.style.width = "140px";
  // _progressCircle.style.height = "140px";
  // _progressCircle.style.boxSizing = "border-box";
  // _progressCircle.style.position = "relative";
  // _progressCircle.style.fill = "none";
  //
  // var x = JSON.parse(item.AttributesItem.JsonEvent);
  // debugger
  // var degree = x.initValue / 100;
  // _progressCircle.style.backgroundImage = `conic-gradient(green 0deg, green ${(degree * 360)}deg, grey ${(degree * 360)}deg)`;
  //
  // _progressCircle.style.borderRadius = "50%";
  // item.value.appendChild(_progressCircle);
}

//
// <!DOCTYPE html>
// <html>
// <style>
//
// svg {
// 	width: 170px;
// 	height: 170px;
// }
//
// .bg {
// 	fill: none;
// 	stroke-width: 3px;
// 	stroke: #1A2C34;
// }
//
// .meter-2 {
// 	fill: none;
// 	stroke-width: 3px;
// 	stroke-linecap: round;
// 	transform: rotate(-90deg);
// 	transform-origin: 50% 50%;
// }
//
// .meter-2 {
// 	stroke: lime;
// 	stroke-dasharray: calc(170 * 3.14159);
// 	stroke-dashoffset: calc((170 * 3.14159)/3);
// 	animation: progress-2 2s;
// }
//
// @keyframes progress-2 {
// 	from {
// 		stroke-dashoffset: calc(170 * 3.14159);
// 	}
// 	to {
// 		stroke-dashoffset: calc((170 * 3.14159)/3);
// 	}
// }
//
//
// </style>
// <body>
//
// <svg>
// 	<circle class="bg" cx="85" cy="85" r="83" />
// 	<circle class="meter-2" cx="85" cy="85" r="83" />
// </svg>
//
//
// </body>
// </html>
