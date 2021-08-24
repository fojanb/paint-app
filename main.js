const wrapper = document.querySelector(".wrapper");
const board = document.querySelector(".board");
const boardCtx = board.getContext("2d");
const options = {
  WIDTH: 900,
  HEIGHT: 500,
};
let coord = { x: 0, y: 0 };
board.width = options.WIDTH;
board.height = options.HEIGHT;

function startDraw(event) {
    
    boardCtx.beginPath();
    boardCtx.lineWidth = 5;
    boardCtx.lineCap = "round";
    boardCtx.strokeStyle = "#ffffff";
    boardCtx.moveTo(coord.x, coord.y);
    coord.x = event.clientX - board.offsetLeft;
    coord.y = event.clientY - board.offsetTop;
    boardCtx.lineTo(coord.x, coord.y);
    boardCtx.stroke();
}
function endDraw() {
  
  console.log("End drawing");
}
board.addEventListener("mousedown", startDraw);
board.addEventListener("mouseup", endDraw);
