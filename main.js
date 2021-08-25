const wrapper = document.querySelector(".wrapper");
const board = document.querySelector(".board");
const boardCtx = board.getContext("2d");
boardCtx.canvas.width = window.innerWidth;
boardCtx.canvas.height = window.innerHeight - 60;
let isDrawing = false;
const options = {
  SHAPE: "round",
  COLOR: "#37017c",
  "LINE WEIGHT": 5,
};
boardCtx.lineWidth = options["LINE WEIGHT"];
boardCtx.lineCap = options.SHAPE;
boardCtx.lineJoin = options.SHAPE;
boardCtx.strokeStyle = options.COLOR;

function draw(event) {
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
function start(e) {
  isDrawing = !isDrawing;
  boardCtx.moveTo(e.clientX, e.clientY);
  // boardCtx.beginPath();
  board.addEventListener("mousemove", draw);
}
function end() {
  isDrawing = !isDrawing;
  board.removeEventListener("mousemove", draw);
}
board.addEventListener("mousedown", start);
board.addEventListener("mouseup", end);
