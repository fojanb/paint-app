const canvas = document.querySelector(".board");
const ctx = canvas.getContext("2d");
const colorPalette = document.querySelector("#colorChange");
const widthScale = document.querySelector("#lineWidth");
const saveButton = document.querySelector("#btnSave");
const clearButton = document.querySelector("#btnClear");
const backButton = document.querySelector("#btnBack");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight - 40;
let isDrawing = false;
const options = {
  SHAPE: "round",
  COLOR: "#fff", //Default pen color
  "LINE WEIGHT": 5, //Default line width
};
// ------------------------#
// Canvas initializations
ctx.lineWidth = options["LINE WEIGHT"];
ctx.lineCap = options.SHAPE;
ctx.lineJoin = options.SHAPE;
ctx.strokeStyle = options.COLOR;
// ------------------------#
function draw(e) {
  if (isDrawing) {
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.closePath();
    ctx.stroke();
    ctx.moveTo(e.clientX, e.clientY);
  } else {
    ctx.moveTo(e.clientX, e.clientY);
  }
}
function startDraw(e) {
  isDrawing = !isDrawing;
  ctx.moveTo(e.clientX, e.clientY);
  // ctx.beginPath();
  canvas.addEventListener("mousemove", draw);
}
function endDraw() {
  isDrawing = !isDrawing;
  canvas.removeEventListener("mousemove", draw);
}
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath(); // clear existing drawing paths
}
function manageBackBtn() {
  canvas.style.display = "block";
  document.getElementById("saveArea").style.display = "none";
  document.getElementById("tools").style.display = "block";
}
function saveCanvas() {
  // smth
}
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", endDraw);
clearButton.addEventListener("click", clearCanvas, false);
backButton.addEventListener("click", manageBackBtn);

// >>>------------> Audio Section <------------<<<
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
