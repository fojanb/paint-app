const wrapper = document.querySelector(".wrapper");
const board = document.querySelector(".board");
const boardCtx = board.getContext("2d");
const options = {
  WIDTH: 900,
  HEIGHT: 500,
};
let coord = { x: 0, y: 0 };
const SHAPE = "round";

board.width = options.WIDTH;
board.height = options.HEIGHT;
function draw(event) {
  boardCtx.beginPath();
  boardCtx.lineWidth = 5;
  boardCtx.lineCap = SHAPE;
  boardCtx.strokeStyle = "#ffffff";
  coord.x = event.clientX - board.offsetLeft;
  coord.y = event.clientY - board.offsetTop;
  boardCtx.moveTo(coord.x, coord.y);
  boardCtx.lineTo(coord.x, coord.y);
  boardCtx.stroke();
}
function start() {
  board.addEventListener("mousemove", draw);
}
function end() {
  board.removeEventListener("mousemove", draw)
  console.log("End drawing");
}
board.addEventListener("mousedown", start);
board.addEventListener("mouseup", end);
