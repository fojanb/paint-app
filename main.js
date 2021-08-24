const wrapper = document.querySelector(".wrapper");
const board = document.querySelector(".board");
const boardCtx = board.getContext("2d");
const options = {
  WIDTH: 900,
  HEIGHT: 500,
};
board.width = options.WIDTH;
board.height = options.HEIGHT;

function draw() {
  boardCtx.strokeStyle = "#fff";
  boardCtx.lineWidth = 7;
  console.log("You are drawing");
}
board.addEventListener("click", draw);
