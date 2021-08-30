const canvas = document.querySelector(".board");
const ctx = canvas.getContext("2d");
const colorPalette = document.querySelector("#colorChange");
const widthScale = document.querySelector("#lineWidth");
const saveButton = document.querySelector("#btnSave");
const clearButton = document.querySelector("#btnClear");
const backButton = document.querySelector("#btnBack");
const eraserButton = document.querySelector("#btnEraser");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 80;
let isDrawing = false;
const options = {
  SHAPE: "round",
};
// ------------------------#
// Canvas initializations
ctx.lineCap = options.SHAPE;
ctx.lineJoin = options.SHAPE;
canvas.style.cursor = "crosshair";
ctx.strokeStyle = colorPalette.value;
ctx.lineWidth = widthScale.value;
// ------------------------#
// Draw logic

const startDrawing = (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
};
const stopDrawing = () => {
  isDrawing = false;
};
const draw = (e) => {
  if (!isDrawing) return;
  ctx.lineTo(e.clientX, e.clientY);
  ctx.stroke();
};
const enterCanvas = (e) => {
  ctx.beginPath();
};
window.addEventListener("mousedown", startDrawing);
window.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseover", enterCanvas);
// ------------------------------------------------
const clearCanvas = () => {
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
// const erase = () => {
//   ctx.globalCompositeOperation = "destination-out";
// }
// eraserButton.addEventListener("click", erase);

colorPalette.addEventListener("change", () => {
  ctx.strokeStyle = colorPalette.value;
  ctx.globalCompositeOperation = "source-over";

  ctx.beginPath();
});
// >>>------------> Erase Button <------------<<<
/*Pixel-based eraser (redraw)*/
let eraser = true; //Toggle variable
const color = "#080014"; 
const erase = () => (ctx.globalCompositeOperation = "destination-out");


eraserButton.addEventListener("click", erase);
