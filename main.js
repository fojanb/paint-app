const canvas = document.querySelector(".board");
const ctx = canvas.getContext("2d");
const colorPalette = document.querySelector("#colorChange");
const widthScale = document.querySelector("#lineWidth");
const saveButton = document.querySelector("#btnSave");
const clearButton = document.querySelector("#btnClear");
const backButton = document.querySelector("#btnBack");
const eraserButton = document.querySelector("#btnEraser");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight - 80;
let isDrawing = false;
const options = {
  SHAPE: "round",
  COLOR: "#fff", //Default pen color
  "LINE WEIGHT": 3, //Default line width (1 to 20)
};
// ------------------------#
// Canvas initializations
ctx.lineWidth = options["LINE WEIGHT"];
ctx.lineCap = options.SHAPE;
ctx.lineJoin = options.SHAPE;
ctx.strokeStyle = options.COLOR;
// ------------------------#
const draw = (e) => {
  if (isDrawing) {
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.closePath();
    ctx.stroke();
    ctx.moveTo(e.clientX, e.clientY);
  } else {
    ctx.moveTo(e.clientX, e.clientY);
  }
};
const startDraw = (e) => {
  isDrawing = !isDrawing;
  ctx.moveTo(e.clientX, e.clientY);
  // ctx.beginPath();
  canvas.addEventListener("mousemove", draw);
};
const endDraw = () => {
  isDrawing = !isDrawing;
  canvas.removeEventListener("mousemove", draw);
};
const clearCanvas = () => {
  // ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath(); // clear existing drawing paths
};
const manageBackBtn = () => {
  canvas.style.display = "block";
  document.getElementById("saveArea").style.display = "none";
  document.getElementById("tools").style.display = "block";
};
const manageSaveBtn = () => {
  document.getElementById("saveArea").style.display = "block";
  document.getElementById("tools").style.display = "none";
};
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", endDraw);
clearButton.addEventListener("click", clearCanvas, false);
backButton.addEventListener("click", manageBackBtn);
saveButton.addEventListener("click", manageSaveBtn);
// >>>------------> Audio Section <------------<<<
let audioIN = { audio: true };
navigator.mediaDevices
  .getUserMedia(audioIN)
  .then((mediaStreamObj) => {
    let audio = document.querySelector("audio");
    if ("srcObject" in audio) {
      audio.srcObject = mediaStreamObj;
    } else {
      audio.src = window.URL.createObjectURL(mediaStreamObj);
    }
    audio.onloadedmetadata = function () {
      audio.play();
    };
    let start = document.getElementById("btnStart");
    let stop = document.getElementById("btnStop");
    let playAudio = document.getElementById("audioPlay");
    let mediaRecorder = new MediaRecorder(mediaStreamObj);
    start.addEventListener("click", () => {
      mediaRecorder.start();
    });
    stop.addEventListener("click", () => {
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
  .catch((err) => {
    console.log(err.name, err.message);
  });
// >>>------------> Width Scale <------------<<<
widthScale.addEventListener("change", () => {
  ctx.lineWidth = widthScale.value;
  ctx.beginPath(); // clear existing drawing paths
});
// >>>------------> Color Palette <------------<<<
colorPalette.addEventListener("change", () => {
  ctx.strokeStyle = colorPalette.value;
  ctx.beginPath(); // clear existing drawing paths
});
// >>>------------> Erase Button <------------<<<
let eraser = true;
const startErase = () => {
  if (eraser) {
    canvas.style.cursor = "url('./assets/eraser.png'), auto";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = (widthScale.value)*2;
    ctx.beginPath();
  }
};
const endErase = () => {
  eraserButton.addEventListener("click", erase);
};

const erase = () => {
  eraserButton.classList.toggle("eraserBtn");
  canvas.style.cursor = "url('./assets/eraser.png'), auto";
  canvas.addEventListener("mousedown", startErase);
  canvas.addEventListener("mouseup", endErase);
};

eraserButton.addEventListener("click", erase);
