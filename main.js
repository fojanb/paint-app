const wrapper = document.querySelector(".wrapper");
const board = document.querySelector(".board");
const boardCtx = board.getContext("2d");
const clearButton = document.querySelector("#btnClear");
const backButton = document.querySelector("#btnBack");
const widthSlider = document.querySelector("#lineWidth");
boardCtx.canvas.width = window.innerWidth;
boardCtx.canvas.height = window.innerHeight - 40;
let isDrawing = false;
const options = {
  SHAPE: "round",
  COLOR: "#fff",
  "LINE WEIGHT": 5,
};
boardCtx.lineWidth = options["LINE WEIGHT"];
boardCtx.lineCap = options.SHAPE;
boardCtx.lineJoin = options.SHAPE;
boardCtx.strokeStyle = options.COLOR;

function draw(e) {
  if (isDrawing) {
    boardCtx.lineTo(e.clientX - board.offsetLeft, e.clientY - board.offsetTop);
    boardCtx.closePath();
    boardCtx.stroke();
    boardCtx.moveTo(e.clientX, e.clientY);
  } else {
    boardCtx.moveTo(e.clientX, e.clientY);
  }
}
function startDraw(e) {
  isDrawing = !isDrawing;
  boardCtx.moveTo(e.clientX, e.clientY);
  // boardCtx.beginPath();
  board.addEventListener("mousemove", draw);
}
function endDraw() {
  isDrawing = !isDrawing;
  board.removeEventListener("mousemove", draw);
}
function clearCanvas() {
  boardCtx.clearRect(0, 0, boardCtx.canvas.width, boardCtx.canvas.height);
}
function manageBack() {
  board.style.display = "block";
  document.getElementById("saveArea").style.display = "none";
  document.getElementById("tools").style.display = "block";
}
function saveCanvas() {
  // smth
}
board.addEventListener("mousedown", startDraw);
board.addEventListener("mouseup", endDraw);
clearButton.addEventListener("click", clearCanvas);
backButton.addEventListener("click", manageBack);

// >>>------------> Audio section <------------<<<
let audioIN = { audio: true };
navigator.mediaDevices
  .getUserMedia(audioIN)
  .then(function (mediaStreamObj) {
    let audio = document.querySelector("audio");
    if ("srcObject" in audio) {
      audio.srcObject = mediaStreamObj;
    } else {
      audio.src = window.URL.createObjectURL(mediaStreamObj);
    }
    audio.onloadedmetadata = function (event) {
      audio.play();
    };
    let start = document.getElementById("btnStart");
    let stop = document.getElementById("btnStop");
    let playAudio = document.getElementById("adioPlay");
    let mediaRecorder = new MediaRecorder(mediaStreamObj);
    start.addEventListener("click", function () {
      mediaRecorder.start();
    });
    stop.addEventListener("click", function () {
      mediaRecorder.stop();
    });
    mediaRecorder.ondataavailable = function (e) {
      dataArray.push(e.data);
    };
    let dataArray = [];
    mediaRecorder.onstop = function () {
      let audioData = new Blob(dataArray, { type: "audio/mp3;" });
      dataArray = [];
      let audioSrc = window.URL.createObjectURL(audioData);
      playAudio.src = audioSrc;
    };
  })
  .catch(function (err) {
    console.log(err.name, err.message);
  });
// >>>------------> Width slider <------------<<<
widthSlider.addEventListener("change", () => {
  boardCtx.lineWidth = widthSlider.value;
});
