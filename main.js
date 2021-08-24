const wrapper = document.querySelector(".wrapper");
const board = document.querySelector(".board");
const boardCtx = board.getContext("2d");
const options = {
  WIDTH: 900,
  HEIGHT: 500,
  SHAPE: "round",
  COLOR: "#ffffff",
  "LINE WEIGHT":5 ,
};
let coord = { x: 0, y: 0 };
board.width = options.WIDTH;
board.height = options.HEIGHT;

function draw(event) {
  boardCtx.beginPath();
  boardCtx.lineWidth = options["LINE WEIGHT"];
  boardCtx.lineCap = options.SHAPE;
  boardCtx.strokeStyle = options.COLOR;
  boardCtx.moveTo(coord.x, coord.y);
  coord.x = event.clientX - board.offsetLeft;
  coord.y = event.clientY - board.offsetTop;
  boardCtx.lineTo(coord.x, coord.y);
  boardCtx.stroke();
}
function start() {
  board.addEventListener("mousemove", draw);
}
function end() {
  board.removeEventListener("mousemove", draw);
}
board.addEventListener("mousedown", start);
board.addEventListener("mouseup", end);
