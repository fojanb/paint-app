const wrapper = document.querySelector(".wrapper");
const board = document.querySelector(".board");
const boardCtx = board.getContext("2d");
let isDrawing = false;
const options = {
  WIDTH: 900,
  HEIGHT: 500,
  SHAPE: "round",
  COLOR: "#ffffff",
  "LINE WEIGHT": 5,
};
board.width = options.WIDTH;
board.height = options.HEIGHT;

function draw(event) {
  boardCtx.beginPath();
  boardCtx.lineWidth = options["LINE WEIGHT"];
  boardCtx.lineCap = options.SHAPE;
  boardCtx.strokeStyle = options.COLOR;
  if (isDrawing) {
    boardCtx.lineTo(
      event.clientX - board.offsetLeft,
      event.clientY - board.offsetTop
    );
    boardCtx.closePath();
    boardCtx.stroke();
    boardCtx.moveTo(event.clientX, event.clientY);
  } else {
    boardCtx.moveTo(event.clientX, event.clientY);
  }
}
function start() {
  isDrawing = true;
  board.addEventListener("mousemove", draw);
}
function end() {
  board.removeEventListener("mousemove", draw);
}
board.addEventListener("mousedown", start);
board.addEventListener("mouseup", end);
