const wrapper = document.querySelector(".wrapper");
const board = document.querySelector(".board");
const boardCtx = board.getContext("2d");
const clear = document.querySelector("#btnClear");
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

function draw(event) {
  if (isDrawing) {
    boardCtx.lineTo(event.clientX - board.offsetLeft, event.clientY - board.offsetTop);
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
function clearCanvas() {
  boardCtx.clearRect(0, 0, board.width, board.height);
}
board.addEventListener("mousedown", start);
board.addEventListener("mouseup", end);
clear.addEventListener("click", clearCanvas);

// Audio section--------->
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
    audio.onloadedmetadata = function (ev) {
      audio.play();
    };
    let start = document.getElementById("btnStart");
    let stop = document.getElementById("btnStop");
    let playAudio = document.getElementById("adioPlay");
    let mediaRecorder = new MediaRecorder(mediaStreamObj);
    start.addEventListener("click", function (ev) {
      mediaRecorder.start();
    });
    stop.addEventListener("click", function (ev) {
      mediaRecorder.stop();
    });
    mediaRecorder.ondataavailable = function (ev) {
      dataArray.push(ev.data);
    };
    let dataArray = [];
    mediaRecorder.onstop = function (ev) {
      let audioData = new Blob(dataArray, { type: "audio/mp3;" });
      dataArray = [];
      let audioSrc = window.URL.createObjectURL(audioData);
      playAudio.src = audioSrc;
    };
  })
  .catch(function (err) {
    console.log(err.name, err.message);
  });
